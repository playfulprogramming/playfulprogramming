import { Root, Element } from "hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { HeaderLink } from "./heading-link";

/**
 * Rehype plugin that adds a link SVG icon adjacent to each heading
 * tag to act as a permalink
 */
export const rehypeHeadingLinks: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, (node: Element) => {
			if (!/h[1-6]/.test(node.tagName)) return;

			// add relative position to the containing header
			node.properties.style =
				(node.properties.style || "") + "position: relative;";

			// create an absolute link icon adjacent to the header contents
			const hastHeader = HeaderLink({
				slug: node.properties.id.toString(),
				title: node.properties["data-header-text"].toString(),
			});

			node.children = [hastHeader, ...node.children];
		});
	};
};
