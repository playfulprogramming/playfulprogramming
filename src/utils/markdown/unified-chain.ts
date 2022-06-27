import { PluggableList, unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

interface markdownChainProps {
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
}

export const unifiedChain = ({
  remarkPlugins,
  rehypePlugins,
}: markdownChainProps) => {
  return unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkStringify)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypePlugins)
    .use(rehypeStringify, { allowDangerousHtml: true });
};
