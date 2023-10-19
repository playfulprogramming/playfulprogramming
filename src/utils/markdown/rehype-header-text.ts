import { headingRank } from "hast-util-heading-rank";
import { hasProperty } from "hast-util-has-property";
import { toString } from "hast-util-to-string";
import { Root, Parent } from "hast";
import { visit } from "unist-util-visit";
import { PostHeadingInfo } from "src/types/index";

/**
 * Plugin to add `data-header-text`s to headings.
 */
export const rehypeHeaderText = () => {
	return (tree: Root, file) => {
		const headingsWithId: PostHeadingInfo[] =
			(file.data.astro.frontmatter.headingsWithId = []);

		visit(tree, "element", (node: Parent["children"][number]) => {
			if (
				headingRank(node) &&
				"properties" in node &&
				node.properties &&
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

				const headingWithID = {
					value: headerText,
					depth: headingRank(node)!,
					slug: node.properties["id"]! as string,
				};

				headingsWithId.push(headingWithID);
			}
		});
	};
};
