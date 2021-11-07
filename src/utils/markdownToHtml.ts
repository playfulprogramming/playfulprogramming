import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from 'remark-rehype';
import rehypeStringify from "rehype-stringify";
import path from "path";
import {postsDirectory} from "../api";

// Optional now. Probably should move to an array that's passed or something
// TODO: Create types
const behead = require('remark-behead')
const rehypeImageSize = require('rehype-img-size');

export default async function markdownToHtml(slug: string, markdown: string) {
  const result = await unified()
      .use(remarkParse)
      /* start remark plugins here */
      .use(behead, { after: 0, depth: 1 })
      /* end remark plugins here */
      .use(remarkStringify)
      .use(remarkToRehype)
      /* start rehype plugins here */
      // TODO: https://github.com/ksoichiro/rehype-img-size/issues/4
      .use(rehypeImageSize, {
        dir: path.resolve(postsDirectory, slug),
      })
      /* end rehype plugins here */
      .use(rehypeStringify)
      .process(markdown);

  return result.toString()
}
