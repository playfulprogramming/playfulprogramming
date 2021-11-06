import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from 'remark-rehype';
import rehypeStringify from "rehype-stringify";

import * as React from 'react'
// TODO: Create types
const behead = require('remark-behead')

export default async function markdownToHtml(slug: string, markdown: string) {
  const result = await unified()
      .use(remarkParse)
      /* start remark plugins here */
      .use(behead, { after: 0, depth: 1 })
      /* end remark plugins here */
      .use(remarkStringify)
      .use(remarkToRehype)
      /* start rehype plugins here */

      /* end rehype plugins here */
      .use(rehypeStringify)
      .process(markdown);

  return result.toString()
}
