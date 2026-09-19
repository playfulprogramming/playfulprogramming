import type { Root } from "mdast";
import type { Plugin } from "unified";
import { commentComponents } from "./micromark-extension.ts";
import { commentComponentsFromMarkdown } from "./from-markdown.ts";
import { commentComponentsToMarkdown } from "./to-markdown.ts";
import type { Options as ToMarkdownOptions } from "mdast-util-to-markdown";

declare module "unified" {
	interface Data {
		toMarkdownExtensions?: ToMarkdownOptions[];
	}
}

export interface RemarkCommentComponentsOptions {
	/** Fail after reporting every component diagnostic. Defaults to false. */
	fatal?: boolean;
}

/** Register syntax before parsing and report its diagnostics during run(). */
export const remarkCommentComponents: Plugin<
	[RemarkCommentComponentsOptions?],
	Root
> = function (options = {}) {
	const data = this.data();
	(data.micromarkExtensions ??= []).push(commentComponents());
	(data.fromMarkdownExtensions ??= []).push(commentComponentsFromMarkdown());
	(data.toMarkdownExtensions ??= []).push(commentComponentsToMarkdown());

	return (tree, file) => {
		const diagnostics = tree.data?.commentComponentDiagnostics ?? [];
		for (const diagnostic of diagnostics) {
			file.message(diagnostic.message, {
				place: diagnostic.position,
				ruleId: diagnostic.ruleId,
				source: "mdast-comment-components",
			});
		}
		if (options.fatal && diagnostics.length) {
			file.fail("Malformed Markdown comment components.", {
				source: "mdast-comment-components",
				ruleId: "invalid-components",
			});
		}
	};
};
