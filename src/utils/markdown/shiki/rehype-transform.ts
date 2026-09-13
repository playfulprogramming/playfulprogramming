import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
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

interface RehypeShikiOptions {
	/** Replace each highlighted block with its HTML instead of its hast tree */
	serialize?: boolean;
}

const htmlOptions = { allowDangerousHtml: true, voids: [] };

export const rehypeShikiUU: Plugin<[RehypeShikiOptions?], Root, Root> =
	function ({ serialize = false } = {}) {
		return async (tree) => {
			const highlights: Promise<void>[] = [];
			visit(
				tree,
				{ type: "element", tagName: "pre" },
				(node, index, parent) => {
					if (index === undefined || !parent || isMermaidCodeBlock(node))
						return;
					highlights.push(
						runShiki(node).then((highlighted) => {
							// eagerly parses code block nodes to html to avoid thousands of extra traversals. Shiki emits many spans per token
							parent.children[index] = serialize
								? {
										type: "raw",
										value: toHtml(highlighted, htmlOptions),
										position: node.position,
									}
								: highlighted;
						}),
					);
				},
			);
			await Promise.all(highlights);
		};
	};
