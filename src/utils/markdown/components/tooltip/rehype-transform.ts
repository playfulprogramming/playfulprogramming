import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import { toString } from "hast-util-to-string";
import { type PlayfulRoot, createComponent } from "../components.ts";
import { trimElements } from "#utils/markdown/unist-trim-elements.ts";
import { isValidComponentParent } from "../rehype-validate-components.ts";

/**
 * Plugin to create interactive/styled hint elements from the following structure:
 *
 * <blockquote>
 *  <p><strong>{title}:</strong> ...</p>
 * </blockquote>
 *
 * or
 *
 * <blockquote>
 *  <p><em>{title}:</em> ...</p>
 * </blockquote>
 */
export const rehypeTooltips: Plugin<[], PlayfulRoot> = () => {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (!isValidComponentParent(parent)) return;

			const firstParagraph = node.children.find((e) => e.type === "element");
			if (
				!(firstParagraph?.type === "element" && firstParagraph.tagName === "p")
			)
				return;

			const firstText = firstParagraph.children[0];
			if (
				!(
					firstText?.type === "element" &&
					["strong", "em"].includes(firstText.tagName) &&
					toString(firstText).endsWith(":")
				)
			)
				return;

			// remove `firstText` from children nodes
			firstParagraph.children.splice(0, 1);

			// Trim empty nodes from the start/end of the node
			trimElements(node.children);

			if (parent?.children && index !== undefined) {
				parent.children[index] = createComponent(
					"Tooltip",
					{
						icon: firstText.tagName === "em" ? "warning" : "info",
						title: toString(firstText).replace(/:$/, ""),
					},
					node.children,
				);
			}
		});
	};
};
