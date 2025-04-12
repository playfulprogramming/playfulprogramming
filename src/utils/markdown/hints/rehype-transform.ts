import { Root } from "hast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { Element, Node } from "hast";
import { Hint } from "./hints";
import { toString } from "hast-util-to-string";

function isNodeSummary(e: Node) {
	return e.type === "element" && (e as Element).tagName === "summary";
}

/**
 * Plugin to create interactive/styled hint elements from the following structure:
 *
 * <details>
 * 	 <summary>Title</summary>
 *   Hidden content
 * </details>
 */
export const rehypeHints: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, "element", (node: Element, index, parent) => {
			if (node.tagName !== "details") return;

			const summaryNode = node.children.find(isNodeSummary);

			if (index !== undefined && parent?.children) {
				parent.children[index] = Hint({
					title: toString(summaryNode as never),
					children: node.children.filter((e) => !isNodeSummary(e)),
				});
			}
		});
	};
};
