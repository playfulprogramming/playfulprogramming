import { Root } from "mdast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import JSON5 from "json5";

export const TYPE_FRONTMATTER = "frontmatter";

interface FrontMatterNode {
	type: typeof TYPE_FRONTMATTER;
	// JS object stringified into frontmatter data
	value: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFrontMatterNode(node: any): node is FrontMatterNode {
	return node.type === TYPE_FRONTMATTER;
}

/**
 * Removes frontmatter nodes from the mdast tree
 * so that they do not show up in the output.
 *
 * Preserves the frontmatter data in the vfile data to be used later in other plugins.
 */
export const remarkProcessFrontmatter: Plugin<[], Root> = () => {
	return (tree, vfile) => {
		visit(tree, { type: "frontmatter" }, (node, index, parent) => {
			if (index === undefined || !parent) return;
			const frontmatter: unknown = parent.children.splice(index, 1)[0];
			vfile.data = vfile.data || {};
			if (frontmatter && isFrontMatterNode(frontmatter)) {
				vfile.data.frontmatterData = JSON5.parse(frontmatter.value);
			}
		});
	};
};
