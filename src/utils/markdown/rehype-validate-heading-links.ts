import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { isMarkdownVFile } from "./types.ts";

/**
 * Plugin to validate anchor links to headings and ensure their case matches their target heading IDs.
 */
export const rehypeValidateHeadingLinks: Plugin<[], Root> = () => {
	return (tree, file) => {
		if (!isMarkdownVFile(file)) {
			return;
		}

		const headingSlugsMap = new Map<string, string>();
		for (const slug of file.data.headingIds) {
			const lowerSlug = slug.toLowerCase();
			const existingSlug = headingSlugsMap.get(lowerSlug);

			if (existingSlug && existingSlug !== slug) {
				file.message(
					`[${rehypeValidateHeadingLinks.name}] Multiple headings normalize to "${lowerSlug}" ("${existingSlug}" and "${slug}") in "${file.path}". Using first occurrence.`,
					{
						place: tree.position,
						source: "rehype-validate-heading-links",
						ruleId: "ambiguous-heading",
					},
				);
				continue;
			}

			headingSlugsMap.set(lowerSlug, slug);
		}

		visit(tree, { type: "element", tagName: "a" }, (node) => {
			const href = node.properties["href"];
			if (typeof href !== "string" || !href.startsWith("#")) return;

			const targetHeadingSlug = decodeURIComponent(href.slice(1));
			const headingSlug = headingSlugsMap.get(targetHeadingSlug.toLowerCase());
			if (!headingSlug) {
				file.message(
					`[${rehypeValidateHeadingLinks.name}] Unknown anchor link to heading "${href}" in "${file.path}".`,
					{
						place: node.position,
						source: "rehype-validate-heading-links",
						ruleId: "unknown-heading",
					},
				);
				return;
			}

			if (headingSlug !== targetHeadingSlug) {
				file.message(
					`[${rehypeValidateHeadingLinks.name}] Anchor link to heading "${href}" has wrong case. Replacing with "#${headingSlug}" in "${file.path}".`,
					{
						place: node.position,
						source: "rehype-validate-heading-links",
						ruleId: "heading-case",
					},
				);
				node.properties["href"] = `#${headingSlug}`;
			}
		});
	};
};
