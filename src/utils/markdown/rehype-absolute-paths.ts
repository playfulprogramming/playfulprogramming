import { Element, Root } from "hast";
import { isURL } from "../url-paths";
import { visit } from "unist-util-visit";
import { join } from "path";
import { Plugin } from "unified";

export const rehypeMakeImagePathsAbsolute: Plugin<[{ path: string }], Root> = (
	options,
) => {
	return (tree: Root) => {
		function imgVisitor(node: Element) {
			if (node.tagName === "img") {
				let src = node.properties!.src as string;
				if (!isURL(src)) {
					src = join(options.path, src);
					src = src.replace(/\\/g, "/");
				}
				node.properties!.src = src;
			}
		}

		visit(tree, "element", imgVisitor);
		return tree;
	};
};

export const rehypeMakeHrefPathsAbsolute: Plugin<[], Root> = () => {
	return (tree) => {
		function aVisitor(node: Element) {
			if (node.tagName === "a") {
				const href = node.properties!.href as string;
				if (href.startsWith("#")) {
					return;
				}
				node.properties!.href = new URL(
					href,
					"https://unicorn-utterances.com",
				).toString();
			}
		}
		visit(tree, "element", aVisitor);
		return tree;
	};
};
