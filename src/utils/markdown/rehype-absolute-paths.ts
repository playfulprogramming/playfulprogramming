import { Element, Root } from "hast";
import { isURL } from "../url-paths";
import { visit } from "unist-util-visit";
import { dirname, join } from "path";
import { Plugin } from "unified";
import { VFile } from "vfile";
import { MarkdownVFile } from "./types";

export const rehypeMakeImagePathsAbsolute: Plugin<[], Root> = () => {
	return (tree: Root, file: VFile) => {
		if (!file.path) {
			// We're in a `unified.process` call with the input of a string, not a VFile with a path
			return tree;
		}
		const path = dirname(file.path);

		function imgVisitor(node: Element) {
			if (node.tagName === "img") {
				let src = node.properties!.src as string;
				if (!isURL(src)) {
					src = join(path, src);
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
	return (tree, vfile) => {
		const kind = (vfile as MarkdownVFile).data.kind;
		const slug = (vfile as MarkdownVFile).data.slug;
		function aVisitor(node: Element) {
			if (node.tagName === "a") {
				const href = node.properties!.href as string;
				if (href.startsWith("#")) {
					return;
				}
				if (kind === "post") {
					node.properties!.href = new URL(
						href,
						`https://playfulprogramming.com/posts/${slug}`,
					).toString();
				} else if (kind === "collection") {
					node.properties!.href = new URL(
						href,
						`https://playfulprogramming.com/collections/${slug}`,
					).toString();
				} else {
					node.properties!.href = new URL(
						href,
						"https://playfulprogramming.com",
					).toString();
				}
			}
		}
		visit(tree, "element", aVisitor);
		return tree;
	};
};
