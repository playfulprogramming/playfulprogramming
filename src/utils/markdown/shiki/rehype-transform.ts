import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { toString } from "hast-util-to-string";
import { runShiki } from "./shiki-pool.ts";
import { highlightFence, isTwinkleplopLanguage } from "./twinkleplop.ts";

function codeOf(pre: Element): Element | undefined {
	return pre.children.find(
		(child): child is Element =>
			child.type === "element" && child.tagName === "code",
	);
}

function languageOf(code: Element): string | undefined {
	const classNames = Array.isArray(code.properties.className)
		? code.properties.className.map(String)
		: [];
	return classNames
		.find((name) => name.startsWith("language-"))
		?.slice("language-".length);
}

interface RehypeShikiOptions {
	/** Replace each highlighted block with its HTML instead of its hast tree */
	serialize?: boolean;
}

const htmlOptions = { allowDangerousHtml: true, voids: [] };

// TODO(shiki-removal): rename, and move out of shiki/
export const rehypeShikiUU: Plugin<[RehypeShikiOptions?], Root, Root> =
	function ({ serialize = false } = {}) {
		return async (tree) => {
			const highlights: Promise<void>[] = [];
			visit(
				tree,
				{ type: "element", tagName: "pre" },
				(node, index, parent) => {
					if (index === undefined || !parent) return;
					const code = codeOf(node);
					const language = code && languageOf(code);

					// Mermaid's component transform needs the original fenced-code AST and source.
					if (language === "mermaid") return;

					if (code && language && isTwinkleplopLanguage(language)) {
						const html = highlightFence(
							language,
							code.data?.meta ?? undefined,
							toString(code),
						);
						parent.children[index] = serialize
							? { type: "raw", value: html, position: node.position }
							: (fromHtml(html, { fragment: true }).children[0] as Element);
						return;
					}

					// TODO(shiki-removal): highlight every language with twinkleplop, then delete shiki-pool.ts and worker.ts
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
