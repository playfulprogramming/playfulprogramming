import * as hast from "hast";
import { Plugin } from "unified";
import { RehypeFunctionComponent } from "./types";
import { logError } from "../logger";
import { VFile } from "vfile";
import { isComponentNode } from "./components";
import { compileToPlayfulNodes } from "./rehype-plugin-components";
import { Options as HtmlOptions } from "hast-util-to-html";
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
				processComponents: async (tree) => {
					const root: hast.Root = {
						type: "root",
						children: tree as hast.RootContent[],
					};
					await processComponents(root, vfile);
					return compileToPlayfulNodes(root, { htmlOptions });
				},
			});

			results.push({ index, node, replacement });
		}

		for (const result of results) {
			const replacementNodes = await result.replacement;
			const index = tree.children.indexOf(result.node);
			if (index == -1) continue;
			tree.children.splice(index, 1, ...((replacementNodes ?? []) as never[]));
		}
	}

	return async (tree, vfile) => {
		await processComponents(tree, vfile);
	};
};
