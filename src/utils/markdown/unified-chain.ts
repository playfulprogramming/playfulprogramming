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
  return (
    unified()
      .use(remarkParse)
      .use(remarkPlugins)
      .use(remarkStringify)
      .use(remarkToRehype, { allowDangerousHtml: true })
      .use(rehypePlugins)
      // Voids: [] is required for epub generation, and causes little/no harm for non-epub usage
      .use(rehypeStringify, { allowDangerousHtml: true, voids: [] })
  );
};
