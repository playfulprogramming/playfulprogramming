/**
 * An ode to words
 *
 * Oh words, what can be said of thee?
 *
 * Not much me.
 *
 * See, it's conceived that ye might have intriguing definitions from one-to-another
 *
 * This is to say: "What is a word?"
 *
 * An existential question at best, a sisyphean effort at worst.
 *
 * See, while `forms` and `angular` might be considered one word each: what of `@angular/forms`? Is that 2?
 *
 * Or, what of `@someone mentioned Angular's forms`? Is that 4?
 *
 * This is a long-winded way of saying "We know our word counter is inaccurate, but so is yours."
 *
 * Please do let us know if you have strong thoughts/answers on the topic,
 * we're happy to hear them.
 */
import { Node } from "unist";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

import { unified } from "unified";
import english from "retext-english";
import rehypeRetext from "rehype-retext";
import { AstroVFile } from "utils/markdown/types";
import { Root } from "hast";

interface RemarkCountProps {}

export function count(counts: Record<string, number>) {
	return () => counter;

	function counter(tree: Root) {
		visit(tree, visitor);

		function visitor(node: Node) {
			// Non-"Word" nodes, such as links, inline code blocks, etc.
			if (node.type === "SourceNode") {
				const inlineCount = (node as never as { value: string }).value
					// Split on breaks
					.split(/\b/g)
					// Remove symbols, whitespace, and other gunk
					.filter((str) => /\w+/.exec(str)).length;
				counts["InlineCodeWords"] =
					(counts["InlineCodeWords"] || 0) + inlineCount;
			}
			counts[node.type] = (counts[node.type] || 0) + 1;
		}
	}
}

export type WordCounts = {
	InlineCodeWords: number;
	RootNode: number;
	ParagraphNode: number;
	SentenceNode: number;
	WordNode: number;
	TextNode: number;
	WhiteSpaceNode: number;
	PunctuationNode: number;
	SymbolNode: number;
	SourceNode: number;
};

export const rehypeWordCount: Plugin<[RemarkCountProps | never], Root> = () => {
	return async (tree, file: AstroVFile) => {
		const counts = {} as WordCounts;

		/**
		 * Boy oh howdy, if you thought counting words was hard with Markdown...
		 *
		 * Let's put it this way;
		 *
		 * None of our blog posts use MDX, so it doesn't matter.
		 *
		 * Plus, there's weird syntax parsing issues.
		 */
		if (file.path.includes(".mdx")) {
			file.data.astro.frontmatter.wordCount = 0;
			return;
		}

		await unified()
			.use(rehypeRetext, unified().use(english).use(count(counts)))
			.run(tree as never);

		file.data.astro.frontmatter.wordCount =
			(counts.InlineCodeWords || 0) + (counts.WordNode || 0);
	};
};
