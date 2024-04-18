import { Root } from "mdast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";

export const TYPE_FRONTMATTER = "frontmatter";

/**
 * Removes frontmatter nodes from the mdast tree
 * so that they do not show up in the output.
 */
export const remarkProcessFrontmatter: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, { type: "frontmatter" }, (node, index, parent) => {
			if (index === undefined || !parent) return;
			parent.children.splice(index, 1);
		});
	};
};
