import { Root } from "hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { MarkdownVFile } from "./types";

/**
 * Sets the `math` property on the post if any KaTeX nodes are found.
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
