import * as hast from "hast";
import { Plugin } from "unified";
import { RehypeFunctionComponent } from "./types";
import { logError } from "../logger";
import { VFile } from "vfile";
import { isComponentNode, PlayfulNode, PlayfulRoot } from "./components";
import {
	ComponentElement,
	isComponentElement,
} from "./rehype-parse-components";

type RehypeComponentsProps = {
	components: Record<string, RehypeFunctionComponent>;
};

export const rehypeTransformComponents: Plugin<
	[RehypeComponentsProps],
	hast.Root
> = function ({ components }) {
	async function transformComponents(tree: PlayfulRoot, vfile: VFile) {
		const results: Array<{
			index: number;
			node: ComponentElement | PlayfulNode;
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
				throw new Error();
			}

			// Transform the child components first!
			await transformComponents(
				{ type: "root", children: node.children },
				vfile,
			);

			const replacement = component({
				vfile,
				node,
				attributes: node.data.attributes,
				children: node.children,
			});

			results.push({ index, node, replacement });
		}

		for (const result of results) {
			const replacementNodes = await result.replacement;
			const index = tree.children.indexOf(result.node);
			if (index == -1) {
				logError(vfile, result.node, `Unable to find node replacement!`);
				throw new Error();
			}

			tree.children.splice(index, 1, ...((replacementNodes ?? []) as never[]));
		}
	}

	return async (tree, vfile) => {
		await transformComponents(tree, vfile);
	};
};
