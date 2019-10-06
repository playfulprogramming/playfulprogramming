import { MockUnicorn } from "./mock-unicorn"
import { MockLicense } from "./mock-license"

export const MockPost = {
  id: '123123',
  excerpt: 'This would be an auto generated excerpt of the post in particular',
  html: "<div>Hey there</div>",
  frontmatter: {
    title: "Post title",
    published: '10-10-2010',
    tags: ['item1'],
    description: 'This is a short description dunno why this would be this short',
    authors: [MockUnicorn],
    license: MockLicense
  },
  fields: {
    slug: "/this-post-name-here"
  },
  wordCount: {
    words: 10000
  }
}
