import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import {countContent} from "../utils/count-words";
import PostType from "../types/post";
import {Picked} from "../types/helpers";

export const postsDirectory = join(process.cwd(), 'content/blog')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug<Keys extends Array<keyof PostType>>(slug: string, fields: Keys = [] as any):
    Picked<PostType, Keys> {
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

  const items: Partial<PostType> = {
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

let allPostsCache = new WeakMap<object, PostType[]>();

export function getAllPosts<Keys extends Array<keyof PostType>>(fields: Keys = [] as any, cacheString: null | object = null):
    Array<Picked<PostType, Keys>> {
  if (cacheString) {
    const cacheData = allPostsCache.get(cacheString);
    if (cacheData) return cacheData;
  }

  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields));

  if (cacheString) allPostsCache.set(cacheString, posts as PostType[]);

  return posts
}
