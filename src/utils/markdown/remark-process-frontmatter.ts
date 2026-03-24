import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";

export const TYPE_FRONTMATTER = "frontmatter";

/**
 * Removes frontmatter nodes from the mdast tree
 * so that they do not show up in the output.
 *
 * Preserves the frontmatter data in the vfile data to be used later in other plugins.
 */
export const remarkProcessFrontmatter: Plugin<[], Root> = () => {
	return (tree, _) => {
		visit(tree, { type: TYPE_FRONTMATTER }, (_, index, parent) => {
			if (index === undefined || !parent) return;
			parent.children.splice(index, 1);
		});
	};
};
