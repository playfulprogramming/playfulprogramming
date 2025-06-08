import { Root } from "hast";
import { Plugin } from "unified";
import * as components from "./components";

export const rehypeStringifyComponents: Plugin<[], Root, string> = function () {
	async function processComponents(tree: Root) {
		const nodes = tree.children as unknown as components.Node[];
		const html = nodes
			// only used for epub, so we only need to stringify html nodes... for now
			.map((node) => (node.type === "html" ? node.innerHtml : ""))
			.join("");

		return html;
	}

	this.compiler = processComponents as never;
};
