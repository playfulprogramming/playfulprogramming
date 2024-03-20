import { visit } from "unist-util-visit";
import { Element, Root } from "hast";

const unicodeElement: Element = {
	type: "element",
	tagName: "span",
	properties: {
		style: "margin-right: 3px;",
	},
	children: [
		{
			type: "text",
			value: "\u25BC", // Unicode character for chevron up (▲)
		},
	],
};

export function rehypeExpandDetailsAndSummary() {
	return (tree: Root) => {
		function detailsAndSummaryVisitor(node: Element) {
			if (node.tagName === "details") {
				node.tagName = "div";
				node.properties = {
					...node.properties,
					className: "hint__container",
					open: true,
				};
			}
			if (node.tagName === "summary") {
				node.tagName = "div";
				node.properties = {
					...node.properties,
					className: "hint__title text-style-body-medium-bold",
				};
				// for some reason chevron up icon is not showing up in the EPUB format
				// we have to manually add this whole element as a first child
				node.children.unshift(unicodeElement);
			}
		}
		visit(tree, "element", detailsAndSummaryVisitor);
		return tree;
	};
}
