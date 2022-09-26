import { Root } from "hast";
import { Plugin } from "unified";

import { visit } from "unist-util-visit";

import { EMBED_SIZE } from "./constants";
import { h } from "hastscript";

interface RehypeUnicornIFrameClickToRunProps {}

// TODO: Add switch/case and dedicated files ala "Components"
export const rehypeUnicornIFrameClickToRun: Plugin<
	[RehypeUnicornIFrameClickToRunProps | never],
	Root
> = () => {
	return async (tree, file) => {
		visit(tree, (node: any) => {
			if (node.tagName === "iframe") {
				const width = node.properties.width ?? EMBED_SIZE.w;
				const height = node.properties.height ?? EMBED_SIZE.h;
				const iframeReplacement = h(
					"div",
					{
						"data-iframeurl": node.properties.src,
						"data-width": width,
						"data-height": height,
						style: `height: ${height}px; width: ${width}px;`,
					},
					[h("button", "Run embed")]
				);
				Object.assign(node, iframeReplacement);
			}
		});
	};
};
