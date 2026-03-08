import { Root, Element } from "hast";
import { VFile } from "vfile";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { EMBED_MIN_HEIGHT, EMBED_SIZE } from "../constants";
import {
	ComponentMarkupNode,
	ComponentNode,
	createComponent,
	isComponentMarkup,
} from "../components";
import { logError } from "../logger";
import { getUrlMetadata } from "utils/hoof";
import { rehypeTransformGist } from "./platform-detectors/gist";
import { rehypeTransformVideo } from "./platform-detectors/video";
import { rehypeTransformPost } from "./platform-detectors/post";

interface RehypeUnicornIFrameClickToRunProps {
	srcReplacements?: Array<(val: string, root: VFile) => string>;
}

export const rehypeUnicornIFrameClickToRun: Plugin<
	[RehypeUnicornIFrameClickToRunProps | never],
	Root
> = ({ srcReplacements = [] }) => {
	return async (tree, file) => {
		const iframeNodes: {
			parent: ComponentMarkupNode | Root;
			node: Element;
		}[] = [];
		visit(
			tree,
			{ type: "element", tagName: "iframe" },
			(node: Element, _, parent) => {
				if (!parent) return;
				if (parent !== tree && !isComponentMarkup(parent)) {
					logError(file, node, "Cannot process a nested iframe!");
					throw new Error();
				}

				iframeNodes.push({ parent, node });
			},
		);

		await Promise.all(
			iframeNodes.map(async ({ parent, node }) => {
				let {
					height,
					width,
					// eslint-disable-next-line prefer-const
					dataFrameTitle,
					// eslint-disable-next-line prefer-const
					...propsToPreserve
				} = node.properties;
				let src = String(node.properties.src);

				for (const replacement of srcReplacements) {
					src = replacement(src, file);
				}

				width = width ?? EMBED_SIZE.w;
				height = height ?? EMBED_SIZE.h;

				const metadata = await getUrlMetadata(src).catch((e) => {
					logError(file, node, "Could not fetch URL metadata!", e);
					return undefined;
				});

				if (metadata?.error) {
					logError(file, node, "Partial error fetching URL metadata.");
				}

				const [, heightPx] = /^([0-9]+)(px)?$/.exec(`${height}`) || [];
				if (Number(heightPx) < EMBED_MIN_HEIGHT) height = EMBED_MIN_HEIGHT;

				const index = parent.children.indexOf(node);
				if (index == -1) return;

				const pageTitle = String(dataFrameTitle ?? "") || metadata?.title || "";

				const iframeAttrs = Object.fromEntries(
					Object.entries(propsToPreserve).map(([key, value]) => [
						key,
						// Handle array props per hast spec:
						// @see https://github.com/syntax-tree/hast#propertyvalue
						Array.isArray(value) ? value.join(" ") : String(value),
					]),
				);

				// Find any embeds and use them if they're present
				let embedNodes: ComponentNode[] | undefined;
				if (metadata?.embed?.type === "gist") {
					embedNodes = await rehypeTransformGist({
						src,
						metadata,
						embed: metadata.embed,
					});
				}
				if (metadata?.embed?.type === "video") {
					embedNodes = rehypeTransformVideo({
						src,
						metadata,
						embed: metadata.embed,
					});
				}
				if (metadata?.embed?.type === "post") {
					embedNodes = rehypeTransformPost({
						src,
						metadata,
						embed: metadata.embed,
					});
				}

				if (!embedNodes) {
					// Default
					embedNodes = [
						createComponent("IframePlaceholder", {
							width: width.toString(),
							height: height.toString(),
							src: String(src),
							pageTitle,
							pageIcon: metadata?.icon?.src,
							iframeAttrs,
						}),
					];
				}

				parent.children.splice(index, 1, ...embedNodes);
			}),
		);
	};
};
