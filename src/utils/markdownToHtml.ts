import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from 'remark-rehype';
import rehypeStringify from "rehype-stringify";
import remarkGfm from 'remark-gfm'
import path from "path";
import {postsDirectory} from "../api";
import rehypeImageSize from 'rehype-img-size';

// Optional now. Probably should move to an array that's passed or something
// TODO: Create types
const behead = require('remark-behead')

export default async function markdownToHtml(slug: string, markdown: string) {
  const imageDir = path.resolve(postsDirectory, slug);
  const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      /* start remark plugins here */
      .use(behead, { after: 0, depth: 1 })
      /* end remark plugins here */
      .use(remarkStringify)
      .use(remarkToRehype, {allowDangerousHtml: true})
      /* start rehype plugins here */
      // TODO: https://github.com/ksoichiro/rehype-img-size/issues/4
      .use(rehypeImageSize, {
        dir: imageDir,
      })
      /* end rehype plugins here */
      .use(rehypeStringify, {allowDangerousHtml: true})
      .process(markdown);

  return result.toString()
}
