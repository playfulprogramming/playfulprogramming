import type * as hast from "hast";
import type { Plugin } from "unified";
import {
	type PlayfulRoot,
	type PlayfulNode,
	isComponentNode,
	isHtmlNode,
} from "./components.ts";
import { type Options as HtmlOptions, toHtml } from "hast-util-to-html";
import { isElement, isRoot } from "../unist-is-element.ts";

interface ComponentsOptions {
	htmlOptions: HtmlOptions;
}

function containsPlayfulNode(node: PlayfulRoot["children"][number]): boolean {
	return (
		isComponentNode(node) ||
		isHtmlNode(node) ||
		isRoot(node) ||
		(isElement(node) && node.children.some(containsPlayfulNode))
	);
}

export function compileToPlayfulNodes(
	tree: PlayfulRoot,
	options: ComponentsOptions,
): PlayfulNode[] {
	const nodes: PlayfulNode[] = [];
	let pendingHtml: hast.ElementContent[] = [];
	function flushHtml() {
		if (!pendingHtml.length) return;
		nodes.push({
			type: "html",
			innerHtml: toHtml(pendingHtml, options.htmlOptions),
		});
		pendingHtml = [];
	}

	for (const node of tree.children) {
		if (isComponentNode(node)) {
			flushHtml();
			nodes.push({
				...node,
				children: compileToPlayfulNodes(
					{ type: "root", children: node.children ?? [] },
					options,
				),
			});
		} else if (isHtmlNode(node)) {
			flushHtml();
			nodes.push(node);
		} else if (isRoot(node)) {
			flushHtml();
			const children = compileToPlayfulNodes(node, options);
			nodes.push({ type: "root", children });
		} else if (isElement(node) && containsPlayfulNode(node)) {
			flushHtml();
			// Keep enclosing HTML around components without passing custom nodes
			// to toHtml. Force an explicit closing tag to split the empty shell.
			const closingTag = `</${node.tagName}>`;
			const shell = toHtml(
				{ ...node, children: [] },
				{
					...options.htmlOptions,
					omitOptionalTags: false,
					closeEmptyElements: false,
					voids: [],
				},
			);
			nodes.push({
				type: "html",
				innerHtml: shell.slice(0, -closingTag.length),
			});
			nodes.push(
				...compileToPlayfulNodes(
					{ type: "root", children: node.children },
					options,
				),
			);
			nodes.push({ type: "html", innerHtml: closingTag });
		} else {
			pendingHtml.push(node as hast.ElementContent);
		}
	}
	flushHtml();

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
