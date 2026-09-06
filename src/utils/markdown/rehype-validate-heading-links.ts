import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { isMarkdownVFile } from "./types.ts";
import { logError } from "./logger.ts";

/**
 * Plugin to validate anchor links to headings and ensure their case matches their target heading IDs.
 */
export const rehypeValidateHeadingLinks: Plugin<[], Root> = () => {
	return (tree, file) => {
		if (!isMarkdownVFile(file)) {
			return;
		}

		const headings = file.data.headingsWithIds;
		const headingSlugsMap = new Map<string, string>();
		for (const { slug } of headings) {
			const lowerSlug = slug.toLowerCase();
			const existingSlug = headingSlugsMap.get(lowerSlug);

			if (existingSlug && existingSlug !== slug) {
				logError(
					file,
					tree,
					`[${rehypeValidateHeadingLinks.name}] Multiple headings normalize to "${lowerSlug}" ("${existingSlug}" and "${slug}") in "${file.path}". Using first occurrence.`,
				);
				continue;
			}

			headingSlugsMap.set(lowerSlug, slug);
		}

		visit(tree, { type: "element", tagName: "a" }, (node) => {
			const href = node.properties["href"];
			if (typeof href !== "string" || !href.startsWith("#")) return;

			const targetHeadingSlug = href.slice(1);
			const headingSlug = headingSlugsMap.get(targetHeadingSlug.toLowerCase());
			if (!headingSlug) {
				logError(
					file,
					node,
					`[${rehypeValidateHeadingLinks.name}] Unknown anchor link to heading "${href}" in "${file.path}".`,
				);
				return;
			}

			if (headingSlug !== targetHeadingSlug) {
				logError(
					file,
					node,
					`[${rehypeValidateHeadingLinks.name}] Anchor link to heading "${href}" has wrong case. Replacing with "#${headingSlug}" in "${file.path}".`,
				);
				node.properties["href"] = `#${headingSlug}`;
			}
		});
	};
};
