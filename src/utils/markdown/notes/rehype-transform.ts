import { Root } from "hast";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { Element } from "hast";
import { Note } from "./notes";
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
export const rehypeNotes: Plugin<[], Root> = () => {
	return (tree) => {
		visit(tree, (node: Element, index, parent: Element) => {
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
					toString(firstText).endsWith(":")
				)
			)
				return;

			// remove `firstText` from children nodes
			firstParagraph.children.splice(0, 1);

			parent.children[index] = Note({
				icon: firstText.tagName === "em" ? "warning" : "info",
				title: toString(firstText).replace(/:$/, ""),
				children: node.children,
			});
		});
	};
};
