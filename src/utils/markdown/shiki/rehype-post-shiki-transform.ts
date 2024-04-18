import { Root, Element } from "hast";
import { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

/**
 * This rehype plugin is intended to run *after* the rehypeShikiUU plugin
 * to fix up various aspects of its generated HTML.
 *
 * Namely:
 * - Removing the tabindex="0" that shiki places on its <pre> elements... and placing it on the <code> element instead.
 * - Removing the extra trailing line that shiki adds to each codeblock
 */
export const rehypePostShikiTransform: Plugin<[], Root> = () => {
	return (tree) => {
		visit(
			tree,
			{ type: "element", tagName: "code" },
			(node: Element, _, parent) => {
				// Only match <pre><code>...</code></pre>
				if (parent?.type !== "element" || parent?.tagName !== "pre")
					return SKIP;

				// Remove tabindex="0" from the <pre>
				delete parent.properties.tabindex;
				// and set it on the scrollable <code> element instead
				node.properties.tabindex = "0";

				// If the last line in the <code> block is empty, remove it
				// (prevents shiki adding trailing newlines at the end of each block)
				const lastChild = node.children.at(-1);
				if (
					lastChild &&
					lastChild.type === "element" &&
					lastChild.properties.class === "line" &&
					lastChild.children.length === 0
				) {
					node.children.pop();
				}
			},
		);
	};
};
