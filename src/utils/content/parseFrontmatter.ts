import type { Node } from "mdast";
import type { MarkdownVFile } from "../markdown/types";
import { visit } from "unist-util-visit";
import JSON5 from "json5";
import { parseMdast } from "../markdown/satteri-parse.ts";
import { logError } from "../markdown/logger.ts";
import type { Static, TSchema } from "typebox";
import Value, { ParseError } from "typebox/value";

const TYPE_FRONTMATTER = "yaml";

interface FrontMatterNode {
	type: typeof TYPE_FRONTMATTER;
	// JS object stringified into frontmatter data
	value: string;
}

function isFrontMatterNode(node: Node): node is FrontMatterNode {
	return node.type === TYPE_FRONTMATTER;
}

export async function parseFrontmatter<T extends TSchema>(
	vfile: MarkdownVFile,
	schema: T,
): Promise<{ frontmatter: Static<T>; frontmatterNode: Node }> {
	const tree: Node = parseMdast(String(vfile.value));

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

	let frontmatterJson: unknown;
	try {
		frontmatterJson = JSON5.parse(frontmatterNode.value);
	} catch (e) {
		logError(
			vfile,
			frontmatterNode,
			e instanceof Error ? e.message : String(e),
		);
	}

	let frontmatter: Static<T> | undefined;
	try {
		frontmatter = Value.Parse(
			schema,
			Value.Default(schema, Value.Clone(frontmatterJson)),
		);
	} catch (e) {
		if (e instanceof ParseError) {
			for (const error of e.cause.errors) {
				logError(
					vfile,
					frontmatterNode,
					`${error.schemaPath}: ${error.message}`,
				);
			}
		} else {
			logError(vfile, frontmatterNode, String(e));
		}
	}

	return {
		frontmatter: frontmatter ?? (frontmatterJson as Static<T>),
		frontmatterNode,
	};
}
