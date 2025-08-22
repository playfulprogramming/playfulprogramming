import { Root } from "hast";
import { Plugin } from "unified";
import { PostInfo } from "types/PostInfo";
import { visit } from "unist-util-visit";
import { MarkdownVFile } from "./types";

/**
 * Sets the `math` property on the post if any KaTeX nodes are found.
 */
export const setMathProperty: Plugin<[], Root> = () => {
	return (tree, vfile) => {
		const post = (vfile as MarkdownVFile).data.frontmatter as PostInfo;
		post.math = false;

		visit(tree, "element", (node) => {
			const className = (node?.properties?.className as string[]) ?? [];
			if (className.includes("katex")) {
				console.log("KaTeX node found:");
				post.math = true;
			}
		});
	};
};
