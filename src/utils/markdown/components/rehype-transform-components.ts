import type { Plugin } from "unified";
import type { RehypeFunctionComponent } from "./types.ts";
import type { VFile } from "vfile";
import {
	type ComponentMarkupNode,
	type ComponentNode,
	type PlayfulRoot,
	isComponentMarkup,
	isComponentNode,
} from "./components.ts";

type RehypeComponentsProps = {
	components: Record<string, RehypeFunctionComponent>;
};

export const rehypeTransformComponents: Plugin<
	[RehypeComponentsProps],
	PlayfulRoot
> = function ({ components }) {
	async function transformComponents(tree: PlayfulRoot, vfile: VFile) {
		const results: Array<{
			index: number;
			node: ComponentMarkupNode | ComponentNode;
			replacement: ReturnType<RehypeFunctionComponent>;
		}> = [];

		for (let index = 0; index < tree.children.length; index++) {
			const node = tree.children[index];

			if (isComponentNode(node)) {
				results.push({ index, node, replacement: [node] });
				continue;
			}

			if (!isComponentMarkup(node)) continue;

			// Find the component matching the given tag
			const component = components[node.component];
			if (!component) {
				vfile.fail(`Unknown markdown component ${node.component}`, {
					place: node.position,
					source: "rehype-components",
					ruleId: "unknown-component",
				});
			}

			// Transform the child components first!
			await transformComponents(
				{ type: "root", children: node.children },
				vfile,
			);

			const replacement = component({
				vfile,
				node,
				attributes: node.attributes,
				children: node.children,
			});

			results.push({ index, node, replacement });
		}

		for (const result of results) {
			const replacementNodes = await result.replacement;
			const index = tree.children.indexOf(result.node);
			if (index == -1) {
				vfile.fail("Unable to find node replacement!", {
					place: result.node.position,
					source: "rehype-components",
					ruleId: "missing-replacement",
				});
			}

			tree.children.splice(index, 1, ...(replacementNodes ?? []));
		}
	}

	return async (tree, vfile) => {
		await transformComponents(tree, vfile);
	};
};
