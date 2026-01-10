import { Root, Element } from "hast";
import { VFile } from "vfile";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { EMBED_MIN_HEIGHT, EMBED_SIZE } from "../constants";
import {
	ComponentMarkupNode,
	createComponent,
	isComponentMarkup,
} from "../components";
import { logError } from "../logger";
import { getUrlMetadata } from "utils/hoof";

interface RehypeUnicornIFrameClickToRunProps {
	srcReplacements?: Array<(val: string, root: VFile) => string>;
}

// default icon, used if a frame's favicon cannot be resolved
const defaultPageIcon = "/icons/website.svg";

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
					src,
					// eslint-disable-next-line prefer-const
					dataFrameTitle,
					// eslint-disable-next-line prefer-const
					...propsToPreserve
				} = node.properties;

				for (const replacement of srcReplacements) {
					src = replacement(src!.toString(), file);
				}

				width = width ?? EMBED_SIZE.w;
				height = height ?? EMBED_SIZE.h;
				const metadata = await getUrlMetadata(src!.toString()).catch((e) => {
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
				parent.children.splice(
					index,
					1,
					createComponent("IframePlaceholder", {
						width: width.toString(),
						height: height.toString(),
						src: String(src),
						pageTitle: String(dataFrameTitle ?? "") || metadata?.title || "",
						pageIcon: metadata?.icon?.src || defaultPageIcon,
						iframeAttrs: Object.fromEntries(
							Object.entries(propsToPreserve).map(([key, value]) => [
								key,
								// Handle array props per hast spec:
								// @see https://github.com/syntax-tree/hast#propertyvalue
								Array.isArray(value) ? value.join(" ") : String(value),
							]),
						),
					}),
				);
			}),
		);
	};
};
