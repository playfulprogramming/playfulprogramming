import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { MarkdownVFile } from "./types.ts";

/**
 * Sets `isKatexMathUsed` on post data if any KaTeX nodes are found
 */
export const setMathProperty: Plugin<[], Root> = () => {
	return (tree, vfile) => {
		const data = (vfile as MarkdownVFile).data;

		visit(tree, "element", (node) => {
			const className = (node?.properties?.className as string[]) ?? [];
			if (className.includes("katex")) {
				data.isKatexMathUsed = true;
			}
		});
	};
};
