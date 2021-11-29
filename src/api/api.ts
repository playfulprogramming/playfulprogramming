import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import {countContent} from "../utils/count-words";

export const postsDirectory = join(process.cwd(), 'content/blog')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

type Items = {
  [key: string]: string | number
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, realSlug, `index.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const counts = countContent(content) as {
    InlineCodeWords: number,
    RootNode: number,
    ParagraphNode: number,
    SentenceNode: number,
    WordNode: number,
    TextNode: number,
    WhiteSpaceNode: number,
    PunctuationNode: number,
    SymbolNode: number,
    SourceNode: number
  };

  const items: Items = {
  }

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }
    if (field === 'wordCount') {
      items[field] = (counts.InlineCodeWords || 0) + (counts.WordNode || 0)
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

let allPostsCache = new WeakMap<object, Items[]>();

export function getAllPosts(fields: string[] = [], cacheString: null | object = null) {
  if (cacheString) {
    const cacheData = allPostsCache.get(cacheString);
    if (cacheData) return cacheData;
  }

  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields));

  if (cacheString) allPostsCache.set(cacheString, posts);

  return posts
}
