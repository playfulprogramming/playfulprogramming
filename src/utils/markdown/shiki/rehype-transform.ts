import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { runShiki } from "./shiki-pool";

export const rehypeShikiUU: Plugin<[], Root, Root> = function () {
	return async (tree) => {
		async function visitor(
			node: Element,
			index: number,
			parent: Root | Element,
		) {
			const replacement = await runShiki(node);
			parent.children.splice(index, 1, replacement);
		}

		const promises: Array<Promise<void>> = [];
		visit(tree, { type: "element", tagName: "pre" }, (node, index, parent) => {
			if (index !== undefined && parent !== undefined) {
				promises.push(visitor(node, index, parent));
			}
		});
		await Promise.all(promises);
	};
};
