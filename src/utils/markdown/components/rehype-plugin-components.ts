import { Root } from "hast";
import { Plugin } from "unified";
import { isComponentNode, PlayfulNode } from "./components";
import { toHtml, Options as HtmlOptions } from "hast-util-to-html";

interface ComponentsOptions {
	htmlOptions: HtmlOptions;
}

export function compileToPlayfulNodes(
	tree: Root,
	options: ComponentsOptions,
): PlayfulNode[] {
	const results: Array<{
		index: number;
		node: PlayfulNode;
	}> = [];

	for (let index = 0; index < tree.children.length; index++) {
		const node = tree.children[index];

		if (isComponentNode(node)) {
			results.push({ index, node });
			continue;
		}
	}

	const nodes: PlayfulNode[] = [];
	for (const [result, index] of results.map((r, i) => [r, i] as const)) {
		const preStart = (results[index - 1]?.index ?? -1) + 1;
		const preEnd = result.index - 1;
		if (preEnd - preStart > 0) {
			nodes.push({
				type: "html",
				innerHtml: toHtml(
					tree.children.slice(preStart, preEnd),
					options.htmlOptions,
				),
			});
		}

		nodes.push(result.node);
	}

	if ((results.at(-1)?.index ?? -1) + 1 < tree.children.length) {
		const postStart = (results.at(-1)?.index ?? -1) + 1;
		const postEnd = tree.children.length;
		nodes.push({
			type: "html",
			innerHtml: toHtml(
				tree.children.slice(postStart, postEnd),
				options.htmlOptions,
			),
		});
	}

	return nodes;
}

export const rehypePluginComponents: Plugin<
	[ComponentsOptions],
	Root,
	PlayfulNode[]
> = function (options) {
	function processComponents(tree: Root) {
		return compileToPlayfulNodes(tree, options);
	}

	this.compiler = processComponents as never;
};
