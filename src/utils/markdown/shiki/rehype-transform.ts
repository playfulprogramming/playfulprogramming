// walks files for code block languages and embedded languages to load syntax highlighting. skips handling mermaid for a future pipeline step
import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { bundledLanguages } from "shiki/langs";
import { isSpecialLang } from "shiki/core";
import { runShiki } from "./shiki-pool.ts";
import { getCodeLanguage } from "./get-code-language.ts";
import { logError } from "../logger.ts";

export const rehypeShikiUU: Plugin<[], Root, Root> = function () {
	return async (tree, file) => {
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
			if (index === undefined || parent === undefined) return;
			const lang = getCodeLanguage(node);
			// Mermaid's component transform needs the original fenced-code AST and source.
			if (lang === "mermaid") return;
			if (lang && !(lang in bundledLanguages) && !isSpecialLang(lang)) {
				logError(
					file,
					node,
					`Unrecognized code block language "${lang}"; highlights will not be applied`,
				);
				return;
			}
			promises.push(visitor(node, index, parent));
		});
		await Promise.all(promises);
	};
};
