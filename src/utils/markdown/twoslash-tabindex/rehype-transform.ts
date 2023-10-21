import { Root, Element } from "hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const rehypeTwoslashTabindex: Plugin<[], Root> = () => {
	return async (tree, _) => {
		visit(tree, "element", (node: Element) => {
			if (
				node.tagName === "div" &&
				node.properties.className instanceof Array &&
				node.properties.className.includes("code-container")
			) {
				node.properties.tabindex = "0";
			}
		});

		return tree;
	};
};
