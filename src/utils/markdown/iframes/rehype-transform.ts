import { Root, Element } from "hast";
import { VFile } from "vfile";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { EMBED_MIN_HEIGHT, EMBED_SIZE } from "../constants";
import { IFramePlaceholder } from "./iframe-placeholder";
import { getUrlMetadata } from "utils/hoof/get-url-metadata";
import { logError } from "../logger";

interface RehypeUnicornIFrameClickToRunProps {
	srcReplacements?: Array<(val: string, root: VFile) => string>;
}

// default icon, used if a frame's favicon cannot be resolved
const defaultPageIcon = "/icons/website.svg";

export const rehypeUnicornIFrameClickToRun: Plugin<
	[RehypeUnicornIFrameClickToRunProps | never],
	Root
> = ({ srcReplacements = [], ...props }) => {
	return async (tree, file) => {
		const iframeNodes: Element[] = [];
		visit(tree, "element", (node: Element) => {
			if (node.tagName === "iframe") {
				iframeNodes.push(node);
			}
		});

		await Promise.all(
			iframeNodes.map(async (iframeNode) => {
				let {
					height,
					width,
					src,
					// eslint-disable-next-line prefer-const
					dataFrameTitle,
					// eslint-disable-next-line prefer-const
					...propsToPreserve
				} = iframeNode.properties;

				for (const replacement of srcReplacements) {
					src = replacement(src!.toString(), file);
				}

				width = width ?? EMBED_SIZE.w;
				height = height ?? EMBED_SIZE.h;
				const metadata = await getUrlMetadata(src!.toString()).catch((e) => {
					logError(file, iframeNode, "Could not fetch URL metadata!", e);
					return undefined;
				});

				if (metadata?.error) {
					logError(file, iframeNode, "Partial error fetching URL metadata.");
				}

				const [, heightPx] = /^([0-9]+)(px)?$/.exec(height + "") || [];
				if (Number(heightPx) < EMBED_MIN_HEIGHT) height = EMBED_MIN_HEIGHT;

				const iframeReplacement = IFramePlaceholder({
					width: width.toString(),
					height: height.toString(),
					src: String(src),
					pageTitle: String(dataFrameTitle ?? "") || metadata?.title || "",
					pageIcon: metadata?.icon?.src || defaultPageIcon,
					pageIconFallback: defaultPageIcon,
					propsToPreserve: JSON.stringify(propsToPreserve),
				});

				Object.assign(iframeNode, iframeReplacement);
			}),
		);
	};
};
