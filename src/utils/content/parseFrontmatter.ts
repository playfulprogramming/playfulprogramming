import { unified } from "unified";
import type { Node } from "mdast";
import { MarkdownVFile } from "../markdown/types";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import remarkFrontmatter from "remark-frontmatter";
import JSON5 from "json5";
import { logError } from "../markdown/logger";

const TYPE_FRONTMATTER = "frontmatter";

interface FrontMatterNode {
	type: typeof TYPE_FRONTMATTER;
	// JS object stringified into frontmatter data
	value: string;
}

function isFrontMatterNode(node: Node): node is FrontMatterNode {
	return node.type === TYPE_FRONTMATTER;
}

const unifiedChain = unified()
	.use(remarkParse, { fragment: true } as never)
	.use(remarkFrontmatter, {
		type: TYPE_FRONTMATTER,
		marker: "-",
	} as never);

export async function parseFrontmatter<T>(
	vfile: MarkdownVFile,
): Promise<{ frontmatter: T; frontmatterNode: Node }> {
	const tree: Node = unifiedChain.parse(vfile);

	let frontmatterNode: FrontMatterNode | undefined;
	visit(tree, isFrontMatterNode, (node) => {
		if (frontmatterNode) {
			logError(vfile, node, "Duplicate frontmatter element!");
		} else {
			frontmatterNode = node;
		}
	});

	if (!frontmatterNode) {
		throw new Error(`${vfile.data.file}: Missing frontmatter!`);
	}

	let frontmatter: T | undefined;
	try {
		frontmatter = JSON5.parse(frontmatterNode.value);
	} catch (e) {
		logError(
			vfile,
			frontmatterNode,
			e instanceof Error ? e.message : String(e),
		);
	}

	return { frontmatter: frontmatter ?? ({} as T), frontmatterNode };
}
