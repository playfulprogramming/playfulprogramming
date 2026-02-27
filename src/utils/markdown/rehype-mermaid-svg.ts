import { Root, Element } from "hast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { isElement } from "./unist-is-element";
import { toString } from "hast-util-to-string";
import { fromHtml } from "hast-util-from-html";
import native from "@playfulprogramming/native";
import { logError } from "./logger";
import env from "constants/env";

if (env.PROD && !native) {
	throw new Error("Native package is not built!");
}

export const rehypeMermaidSvg: Plugin<[], Root> = () => {
	return async (tree, vfile) => {
		visit(tree, { type: "element", tagName: "pre" }, (node, index, parent) => {
			if (!parent || typeof index !== "number") return;
			const codeEl = node.children.at(0);
			if (!isElement(codeEl)) return;
			if (codeEl.tagName !== "code") return;
			const className =
				codeEl.properties.className instanceof Array
					? codeEl.properties.className[0]
					: String(codeEl.properties.className);
			if (className !== "language-mermaid") return;
			const mermaidContent = toString(codeEl);

			if (native) {
				const svgHtml = native.renderMermaid(mermaidContent);
				const svgEl = fromHtml(svgHtml, { fragment: true })
					.children[0] as Element;
				svgEl.properties.preserveAspectRatio = "xMinYMin meet";
				svgEl.properties.className = "mermaid";
				parent.children.splice(index, 1, svgEl);
			} else {
				logError(
					vfile,
					node,
					"Cannot render mermaid diagram - native package is not built!",
				);
			}
		});
	};
};
