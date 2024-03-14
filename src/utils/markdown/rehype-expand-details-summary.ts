import { BuildVisitor, visit } from "unist-util-visit";
import { Element, Root } from "hast";

export function rehypeExpandDetailsAndSummary() {
	return (tree: Root) => {
		function preVisitor(node: Element) {
			if (node.tagName === "details") {
				node.properties = { ...node.properties, open: true };
			}
		}
		visit(tree, "element", preVisitor);
		return tree;
	};
}
