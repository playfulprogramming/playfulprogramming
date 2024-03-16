import { Element, Root } from "hast";
import { unified, Plugin } from "unified";
import { BuildVisitor, visit } from "unist-util-visit";
import rehypeParse from "rehype-parse";
import { InContentAd } from "./ad";

export const rehypeInContentAd: Plugin<[], Root> = () => {
	return async (tree) => {
		const transformNode: BuildVisitor = (node, i, parent: Root) => {
			let value = (node as never as { value: string }).value;
			value = value
				.replace(/\s*<!--\s*(.*?)\s*-->\s*/, (match, p1) => {
					return p1;
				})
				.trim();
			if (!value.startsWith("in-content-ad")) return;
			value = `<${value}/>`;
			const root = unified().use(rehypeParse, { fragment: true }).parse(value);
			const el: Element = root.children[0] as never;

			parent.children[i!] = InContentAd(el.properties as never) as never;
		};
		visit(tree, { type: "raw" }, transformNode);
		visit(tree, { type: "comment" }, transformNode);
		return tree;
	};
};
