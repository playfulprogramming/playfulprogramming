import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const SNITIP_PROTOCOL = "pfp-snitip:";

/**
 * EPUB readers cannot open the site's interactive snitips. Preserve the link
 * label as plain inline content instead of emitting a dead custom-protocol URL.
 */
export const rehypeEpubSnitipLinks: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, { type: "element", tagName: "a" }, (node: Element) => {
			if (!String(node.properties.href).startsWith(SNITIP_PROTOCOL)) return;

			node.tagName = "span";
			delete node.properties.href;
		});
	};
};
