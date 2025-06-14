import { Root } from "hast";
import { Plugin } from "unified";
import * as components from "./components";

export const rehypePluginComponents: Plugin<
	[],
	Root,
	components.PlayfulNode[]
> = function () {
	async function processComponents(tree: Root) {
		return tree.children as unknown as components.PlayfulNode[];
	}

	this.compiler = processComponents as never;
};
