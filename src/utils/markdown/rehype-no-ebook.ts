import { Plugin } from "unified";
import { Root } from "hast";
import replaceAllBetween from "unist-util-replace-all-between";

export const rehypeNoEbook: Plugin<[], Root> = () => {
	return (tree) => {
		const replaceTabNodes = () => {
			return [];
		};
		replaceAllBetween(
			tree,
			{ type: "raw", value: "<!-- no-ebook:start -->" } as never,
			{ type: "raw", value: "<!-- no-ebook:end -->" } as never,
			replaceTabNodes,
		);
		replaceAllBetween(
			tree,
			{ type: "comment", value: " no-ebook:start " } as never,
			{ type: "comment", value: " no-ebook:end " } as never,
			replaceTabNodes,
		);
		return tree;
	};
};
