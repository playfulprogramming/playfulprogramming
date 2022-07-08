import { unified } from "unified";
import parse from "remark-parse";
import stringify from "remark-stringify";
import english from "retext-english";
import remark2retext from "remark-retext";
import {visit} from "unist-util-visit";
import { Root, Node, Parent, Text } from "hast";
import flatFilter from "unist-util-flat-filter";

function count(counts: Record<string, number>) {
  return () => counter;

  function counter(tree: Root) {
    visit(tree, visitor);

    function visitor(node: Node) {
      counts[node.type] = (counts[node.type] || 0) + 1;
    }
  }
}

function countInline(counts: Record<string, number>) {
  return () => counter;

  function counter(tree: Root) {
    const inlineCodeAST = flatFilter(
      tree,
      (node) => node.type === "inlineCode"
    ) as Parent;

    counts["InlineCodeWords"] = 0;
    if (inlineCodeAST && inlineCodeAST.children) {
      counts["InlineCodeWords"] = inlineCodeAST.children.reduce(
        (numberOfInline, inlineCodeNode) => {
          const { value } = inlineCodeNode as Text;
          const words = value.split(/\b/g);
          return numberOfInline + words.length;
        },
        0
      );
    }

    return tree;
  }
}

export function countContent(content: string) {
  const counts: Record<string, number> = {};

  unified()
    .use(parse)
    .use(countInline(counts))
    .use(remark2retext, unified().use(english).use(count(counts)))
    .use(stringify)
    .processSync(content);

  return counts;
}
