import { unified } from "unified";
import type { Node } from "mdast";
import type { MarkdownVFile } from "../markdown/types";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import remarkFrontmatter from "remark-frontmatter";
import JSON5 from "json5";
import type { Static, TSchema } from "typebox";
import Value, { ParseError } from "typebox/value";

const TYPE_FRONTMATTER = "frontmatter";

interface FrontMatterNode extends Node {
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

export async function parseFrontmatter<T extends TSchema>(
	vfile: MarkdownVFile,
	schema: T,
): Promise<{ frontmatter: Static<T>; frontmatterNode: Node }> {
	const tree: Node = unifiedChain.parse(vfile);

	let frontmatterNode: FrontMatterNode | undefined;
	visit(tree, isFrontMatterNode, (node) => {
		if (frontmatterNode) {
			vfile.message("Duplicate frontmatter element!", {
				place: node.position,
				source: "parse-frontmatter",
				ruleId: "duplicate-frontmatter",
			});
		} else {
			frontmatterNode = node;
		}
	});

	if (!frontmatterNode) {
		vfile.fail("Missing frontmatter!", {
			place: tree.position,
			source: "parse-frontmatter",
			ruleId: "missing-frontmatter",
		});
	}

	let frontmatterJson: unknown;
	try {
		frontmatterJson = JSON5.parse(frontmatterNode.value);
	} catch (e) {
		vfile.message(e instanceof Error ? e.message : String(e), {
			place: frontmatterNode.position,
			source: "parse-frontmatter",
			ruleId: "invalid-json",
		});
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
				vfile.message(`${error.schemaPath}: ${error.message}`, {
					place: frontmatterNode.position,
					source: "parse-frontmatter",
					ruleId: "invalid-schema",
				});
			}
		} else {
			vfile.message(String(e), {
				place: frontmatterNode.position,
				source: "parse-frontmatter",
				ruleId: "invalid-schema",
			});
		}
	}

	return {
		frontmatter: frontmatter ?? (frontmatterJson as Static<T>),
		frontmatterNode,
	};
}
