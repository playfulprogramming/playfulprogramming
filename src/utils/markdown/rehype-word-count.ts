/**
 * An ode to words
 * 
 * Oh words, what can be said of thee?
 * 
 * Not much me.
 * 
 * See, it's concieved that ye might have intreging definitions from one-to-another
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
import { Root, Parent, Text } from "hast";
import { Node } from "unist";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

import { unified } from "unified";
import english from "retext-english";
import rehypeRetext from 'rehype-retext';
import { validateConfig } from "astro/dist/types/core/config";

interface RemarkCountProps {}

function count(counts: Record<string, number>) {
  return () => counter;

  function counter(tree: Root) {
    visit(tree, visitor);

    function visitor(node: Node) {
      if (node.type === 'SourceNode') {
        const inlineCount = (node as never as {value: string}).value.split(/\b/g).length;
        counts["InlineCodeWords"] = (counts["InlineCodeWords"] || 0) + inlineCount;
      }
      counts[node.type] = (counts[node.type] || 0) + 1;
    }
  }
}

export const rehypeWordCount: Plugin<[RemarkCountProps | never], Root> = () => {
  return async (tree, file) => {
    const counts = {} as {
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

    await unified()
      .use(rehypeRetext, unified().use(english).use(count(counts)))
      .run(tree);

    (file.data.astro as any).frontmatter.wordCount = (counts.InlineCodeWords || 0) + (counts.TextNode || 0);
  };
};
