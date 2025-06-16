import * as hast from "hast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { toString } from "hast-util-to-string";
import { createComponent } from "../components";
import { trimElements } from "utils/markdown/unist-trim-elements";

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
export const rehypeTooltips: Plugin<[], hast.Root> = () => {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "blockquote") return;

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
					toString(firstText as never).endsWith(":")
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
						title: toString(firstText as never).replace(/:$/, ""),
					},
					node.children,
				) as never;
			}
		});
	};
};
