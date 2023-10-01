import { Root, Element } from "hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const rehypeTwoslashTabindex: Plugin<[], Root> = () => {
	return async (tree, _) => {
		visit(tree, (node: Element) => {
			if (
				node.tagName === "div" &&
				node.properties.class === "code-container"
			) {
				node.properties.tabindex = "0";
			}
		});
	};
};
