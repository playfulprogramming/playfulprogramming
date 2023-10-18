import { headingRank } from "hast-util-heading-rank";
import { hasProperty } from "hast-util-has-property";
import { toString } from "hast-util-to-string";
import { Root, Parent } from "hast";
import { visit } from "unist-util-visit";

interface RehypeHeaderClassOpts {
	depth: number;
	className: (depth: number) => string;
}

/**
 * Plugin to act as "rehype-behead", but add a className to display headings
 * at the intended visual level.
 */
export const rehypeHeaderClass = (opts: RehypeHeaderClassOpts) => {
	return (tree: Root, file) => {
		// hacky (temporary) fix to exclude the site/about-us*.mdx files, since
		// those start at a different heading level
		if (file.data.astro.frontmatter.slug === "site") return;

		// Find the minimum heading rank in the file
		// (e.g. if it starts at h2, minDepth = 2)
		let minDepth: number;
		visit(tree, "element", (node: Parent["children"][number]) => {
			const nodeHeadingRank = headingRank(node);
			if (!minDepth || nodeHeadingRank < minDepth) minDepth = nodeHeadingRank;
		});
		minDepth ||= 1;

		visit(tree, "element", (node: Parent["children"][number]) => {
			const nodeHeadingRank = headingRank(node);

			if (
				nodeHeadingRank &&
				"properties" in node &&
				node.properties &&
				!hasProperty(node, "class") &&
				!hasProperty(node, "className")
			) {
				// indent the heading rank by opts.depth - (1 - minDepth), so that:
				// - when (minDepth = 5, depth = 2) h5 + 2 - 4 -> h3
				// - when (minDepth = 1, depth = 2) h1 + 2 + 0 -> h3
				const tagHeadingRank = Math.min(
					nodeHeadingRank + opts.depth + (1 - minDepth),
					6,
				);
				const className = opts.className(nodeHeadingRank);

				node.tagName = "h" + tagHeadingRank;
				node.properties.className = className;

				const headerText = toString(node as never);
				node.properties["data-header-text"] = headerText;
			}
		});
	};
};
