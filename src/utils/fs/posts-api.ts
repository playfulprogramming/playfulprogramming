import fs from "fs";
import { postsDirectory, unicorns } from "utils/fs/get-datas";
import { isNotJunk } from "junk";
import { DeepPartial, DeepReplaceKeys, PickDeep } from "ts-util-helpers";
import { PostInfo } from "types/PostInfo";
import { join } from "path";
import { getExcerpt } from "utils/markdown/getExcerpt";
import { readMarkdownFile } from "utils/fs/api";

export function getPostSlugs() {
  // Avoid errors trying to read from `.DS_Store` files
  return fs.readdirSync(postsDirectory).filter(isNotJunk);
}

type KeysToPick = DeepPartial<DeepReplaceKeys<PostInfo>>;

export function getPostBySlug<ToPick extends KeysToPick>(
  slug: string,
  fields: ToPick = {} as any
): PickDeep<PostInfo, ToPick> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, realSlug, `index.md`);
  const { frontmatterData, pickedData, content } = readMarkdownFile(
    fullPath,
    fields
  );

  if (fields.slug) {
    pickedData.slug = realSlug;
  }

  if (fields.authors) {
    pickedData.authors = (frontmatterData.authors as string[]).map(
      (author) => unicorns.find((unicorn) => unicorn.id === author)!
    );
  }

  if (fields.excerpt) {
    pickedData.excerpt = getExcerpt(content);
  }

  return pickedData as any;
}

let allPostsCache = new WeakMap<object, PostInfo[]>();

export function getAllPosts<ToPick extends KeysToPick>(
  fields: ToPick = {} as any,
  cacheString: null | object = null
): Array<PickDeep<PostInfo, ToPick>> {
  if (cacheString) {
    const cacheData = allPostsCache.get(cacheString);
    if (cacheData) return cacheData as any;
  }

  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug, fields));

  if (cacheString) allPostsCache.set(cacheString, posts as never as PostInfo[]);

  return posts as any[];
}

const listViewCache = {};

export const listViewPostQuery = {
  title: true,
  published: true,
  slug: true,
  authors: {
    firstName: true,
    lastName: true,
    name: true,
    id: true,
  },
  excerpt: true,
  tags: true,
  description: true,
  wordCount: true,
} as const;

export const getAllPostsForListView = () => {
  let allPosts = getAllPosts(listViewPostQuery, listViewCache);

  // sort posts by date in descending order
  allPosts = allPosts.sort((post1, post2) => {
    const date1 = new Date(post1.published);
    const date2 = new Date(post2.published);
    return date1 > date2 ? -1 : 1;
  });

  return allPosts;
};

export type ListViewPosts = ReturnType<typeof getAllPostsForListView>;
