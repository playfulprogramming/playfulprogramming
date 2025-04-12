import { Root } from "hast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { Element } from "hast";
import { Tooltip } from "./tooltips";
import { toString } from "hast-util-to-string";

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
export const rehypeTooltips: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, "element", (node: Element, index, parent) => {
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

			if (parent?.children && index !== undefined) {
				parent.children[index] = Tooltip({
					icon: firstText.tagName === "em" ? "warning" : "info",
					title: toString(firstText as never).replace(/:$/, ""),
					children: node.children,
				});
			}
		});
	};
};
