import type * as hast from "hast";
import type { Plugin } from "unified";
import {
	type PlayfulRoot,
	type PlayfulNode,
	isComponentNode,
	isHtmlNode,
} from "./components.ts";
import { type Options as HtmlOptions, toHtml } from "hast-util-to-html";
import { isRoot } from "../unist-is-element.ts";

interface ComponentsOptions {
	htmlOptions: HtmlOptions;
}

export function compileToPlayfulNodes(
	tree: PlayfulRoot,
	options: ComponentsOptions,
): PlayfulNode[] {
	const results: Array<{
		index: number;
		node: PlayfulNode;
	}> = [];

	for (let index = 0; index < tree.children.length; index++) {
		const node = tree.children[index];

		if (isComponentNode(node)) {
			const compiledNode = {
				...node,
				children: compileToPlayfulNodes(
					{ type: "root", children: node.children ?? [] },
					options,
				),
			};
			results.push({ index, node: compiledNode });
		} else if (isHtmlNode(node)) {
			results.push({ index, node });
		} else if (isRoot(node)) {
			const children = compileToPlayfulNodes(node, options);
			results.push({ index, node: { type: "root", children } });
		}
	}

	const nodes: PlayfulNode[] = [];
	for (const [result, index] of results.map((r, i) => [r, i] as const)) {
		const preStart = (results[index - 1]?.index ?? -1) + 1;
		const preEnd = result.index - 1;
		if (preEnd - preStart > 0) {
			const innerHtml = toHtml(
				tree.children.slice(preStart, preEnd) as hast.ElementContent[],
				options.htmlOptions,
			);
			nodes.push({
				type: "html",
				innerHtml,
			});
		}

		nodes.push(result.node);
	}

	if ((results.at(-1)?.index ?? -1) + 1 < tree.children.length) {
		const postStart = (results.at(-1)?.index ?? -1) + 1;
		const postEnd = tree.children.length;
		const innerHtml = toHtml(
			tree.children.slice(postStart, postEnd) as hast.ElementContent[],
			options.htmlOptions,
		);
		nodes.push({
			type: "html",
			innerHtml,
		});
	}

	return nodes;
}

export const rehypePluginComponents: Plugin<
	[ComponentsOptions],
	PlayfulRoot,
	PlayfulNode[]
> = function (options) {
	function compiler(tree: PlayfulRoot) {
		return compileToPlayfulNodes(tree, options);
	}

	this.compiler = compiler as never;
};
