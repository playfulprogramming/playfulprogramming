import * as hast from "hast";
import { Plugin } from "unified";
import { RehypeFunctionComponent } from "./types";
import { logError } from "../logger";
import { VFile } from "vfile";
import { PlayfulNode, isComponentNode } from "./components";
import { toHtml, Options as HtmlOptions } from "hast-util-to-html";
import {
	ComponentElement,
	isComponentElement,
} from "./rehype-parse-components";

type RehypeComponentsProps = {
	components: Record<string, RehypeFunctionComponent>;
	htmlOptions: HtmlOptions;
};

export const rehypeTransformComponents: Plugin<
	[RehypeComponentsProps],
	hast.Root
> = function ({ components, htmlOptions }) {
	async function processComponents(tree: hast.Root, vfile: VFile) {
		const results: Array<{
			index: number;
			node: ComponentElement;
			replacement: ReturnType<RehypeFunctionComponent>;
		}> = [];

		for (let index = 0; index < tree.children.length; index++) {
			const node = tree.children[index];

			if (isComponentNode(node)) {
				results.push({ index, node, replacement: [node] });
				continue;
			}

			if (!isComponentElement(node)) continue;

			// Find the component matching the given tag
			const component = components[node.properties.name];
			if (!component) {
				logError(
					vfile,
					node,
					`Unknown markdown component ${node.properties.name}`,
				);
				continue;
			}

			const replacement = component({
				vfile,
				node,
				attributes: node.data.attributes,
				children: node.children,
				processComponents: (tree) =>
					processComponents(
						{ type: "root", children: tree as hast.RootContent[] },
						vfile,
					),
			});

			results.push({ index, node, replacement });
		}

		const nodes: PlayfulNode[] = [];
		for (const [result, index] of results.map((r, i) => [r, i] as const)) {
			const preStart = (results[index - 1]?.index ?? -1) + 1;
			const preEnd = result.index - 1;
			if (preEnd - preStart > 0) {
				nodes.push({
					type: "html",
					innerHtml: toHtml(tree.children.slice(preStart, preEnd), htmlOptions),
				});
			}

			const replacement = await result.replacement;
			if (replacement) nodes.push(...replacement);
		}

		if ((results.at(-1)?.index ?? -1) + 1 < tree.children.length) {
			const postStart = (results.at(-1)?.index ?? -1) + 1;
			const postEnd = tree.children.length;
			nodes.push({
				type: "html",
				innerHtml: toHtml(tree.children.slice(postStart, postEnd), htmlOptions),
			});
		}

		return nodes;
	}

	return async (tree, vfile) => {
		const children = await processComponents(tree, vfile);
		tree.children.splice(0, tree.children.length);
		tree.children.push(...(children as unknown as hast.RootContent[]));
	};
};
