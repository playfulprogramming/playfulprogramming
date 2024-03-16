import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit, CONTINUE, EXIT } from "unist-util-visit";

const unifiedChain = unified()
	.use(remarkParse, { fragment: true } as never)
	.use(remarkGfm);

/**
 * Uses a minimal version of the unified chain to parse
 * the provided [markdownContent] into an excerpt no longer
 * than [maxLength].
 */
export function getExcerpt(markdownContent: string, maxLength: number): string {
	const tree = unifiedChain.parse(markdownContent);

	const excerptParts: string[] = [];
	let excerptLength = 0;
	visit(tree, "text", (node) => {
		excerptParts.push(node.value);
		excerptLength += node.value.length;

		if (excerptParts.length < maxLength) return CONTINUE;
		else return EXIT;
	});

	const excerpt = excerptParts.map((s) => s.trim()).join(" ");

	return excerpt.length > maxLength
		? excerpt.slice(0, maxLength - 3) + "..."
		: excerpt;
}
