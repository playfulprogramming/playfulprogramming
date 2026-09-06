import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { runShiki } from "./shiki-pool.ts";

// Mermaid's component transform needs the original fenced-code AST and source.
function isMermaidCodeBlock(node: Element): boolean {
	const code = node.children.find(
		(child): child is Element =>
			child.type === "element" && child.tagName === "code",
	);
	const classNames = Array.isArray(code?.properties.className)
		? code.properties.className.map(String)
		: [];

	return classNames.includes("language-mermaid");
}

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
			if (
				!isMermaidCodeBlock(node) &&
				index !== undefined &&
				parent !== undefined
			) {
				promises.push(visitor(node, index, parent));
			}
		});
		await Promise.all(promises);
	};
};
