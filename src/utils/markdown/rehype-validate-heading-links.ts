import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { isMarkdownVFile } from "./types.ts";
import { logError } from "./logger.ts";

type NodeWithFragmentIds = {
	fragmentIds?: unknown;
};

function fragmentCandidates(fragment: string): string[] {
	try {
		const decodedFragment = decodeURIComponent(fragment);
		return decodedFragment === fragment
			? [fragment]
			: [fragment, decodedFragment];
	} catch {
		return [fragment];
	}
}

/**
 * Validate same-document fragment links and correct the case of heading links.
 */
export const rehypeValidateHeadingLinks: Plugin<[], Root> = () => {
	return (tree, file) => {
		if (!isMarkdownVFile(file)) {
			return;
		}

		const headings = file.data.headingsWithIds;
		const headingSlugsMap = new Map<string, string>();
		const fragmentIds = new Set<string>();
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

		visit(tree, (node) => {
			if (node.type === "element") {
				const id = (node as Element).properties["id"];
				if (typeof id === "string") fragmentIds.add(id);
			}

			const componentFragmentIds = (node as NodeWithFragmentIds).fragmentIds;
			if (!Array.isArray(componentFragmentIds)) return;

			for (const id of componentFragmentIds) {
				if (typeof id === "string") fragmentIds.add(id);
			}
		});

		visit(tree, { type: "element", tagName: "a" }, (node) => {
			const href = node.properties["href"];
			if (typeof href !== "string" || !href.startsWith("#")) return;

			const candidates = fragmentCandidates(href.slice(1));
			if (candidates.some((candidate) => fragmentIds.has(candidate))) return;

			const targetHeadingSlug = candidates.find((candidate) =>
				headingSlugsMap.has(candidate.toLowerCase()),
			);
			const headingSlug = targetHeadingSlug
				? headingSlugsMap.get(targetHeadingSlug.toLowerCase())
				: undefined;
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
