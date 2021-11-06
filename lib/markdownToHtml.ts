import remark from 'remark'
import html from 'remark-html'
// TODO: Create types
const behead = require('remark-behead')

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
      .use(behead, { after: 0, depth: 1 })
      .use(html)
      .process(markdown)
  return result.toString()
}
