import { headingRank } from "hast-util-heading-rank";
import { hasProperty } from "hast-util-has-property";
import { toString } from "hast-util-to-string";
import type { Root, Parent } from "hast";
import type { Plugin } from "unified";
import { visit, SKIP } from "unist-util-visit";
import { isMarkdownVFile } from "./types.ts";

/**
 * Plugin to add `data-header-text`s to headings.
 */
export const rehypeHeaderText: Plugin<[], Root> = () => {
	return (tree, file) => {
		const [headingIds, headingsWithIds] = isMarkdownVFile(file)
			? [file.data.headingIds, file.data.tableOfContents]
			: [[], []];

		visit(tree, "element", (node: Parent["children"][number]) => {
			// Don't descend into tab containers or collapsible <details> elements
			if (
				"properties" in node &&
				(node.properties["role"] === "tabpanel" || node.tagName === "details")
			) {
				return SKIP;
			}

			if (
				node.type === "element" &&
				(node.tagName === "a" || node.tagName === "li") &&
				hasProperty(node, "id")
			) {
				headingIds.push(String(node.properties.id));
			}

			if (
				headingRank(node) &&
				"properties" in node &&
				node.properties &&
				hasProperty(node, "id") &&
				!hasProperty(node, "data-header-text")
			) {
				const headerText = toString(node as never);
				node.properties["data-header-text"] = headerText;

				// wrap header contents in a <span> (for inline text styling on :focus)
				// see: src/views/base/scripts/heading-link.module.scss
				node.children = [
					{
						type: "element",
						tagName: "span",
						properties: {},
						children: node.children,
					},
				];

				const slug = String(node.properties["id"]);
				const headingWithID = {
					value: headerText,
					depth: headingRank(node)!,
					slug,
				};

				headingIds.push(slug);
				headingsWithIds.push(headingWithID);
			}
		});
	};
};
