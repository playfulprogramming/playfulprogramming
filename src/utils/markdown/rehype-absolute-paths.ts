import { Element, Root } from "hast";
import { isRelativePath } from "../url-paths";
import { visit } from "unist-util-visit";
import { join } from "path";

export function rehypeMakeImagePathsAbsolute(options: { path: string }) {
	return (tree: Root) => {
		function imgVisitor(node: Element) {
			if (node.tagName === "img") {
				let src = node.properties!.src as string;
				if (src.startsWith("http")) {
					return;
				}
				if (isRelativePath(src)) {
					src = join(options.path, src);
					src = src.replace(/\\/g, "/");
				}
				node.properties!.src = src;
			}
		}

		visit(tree, "element", imgVisitor);
		return tree;
	};
}

export function rehypeMakeHrefPathsAbsolute() {
	return (tree: Root) => {
		function aVisitor(node: Element) {
			if (node.tagName === "a") {
				let href = node.properties!.href as string;
				if (href.startsWith("#")) {
					return;
				}
				if (isRelativePath(href)) {
					href = "https://unicorn-utterances.com" + href;
					href = href.replace(/\\/g, "/");
				}
				node.properties!.href = href;
			}
		}
		visit(tree, "element", aVisitor);
		return tree;
	};
}
