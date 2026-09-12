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

/** Register syntax and serialization before parsing; no transformer is used. */
export const remarkCommentComponents: Plugin<[], Root> = function () {
	const data = this.data();
	(data.micromarkExtensions ??= []).push(commentComponents());
	(data.fromMarkdownExtensions ??= []).push(commentComponentsFromMarkdown());
	(data.toMarkdownExtensions ??= []).push(commentComponentsToMarkdown());
};
