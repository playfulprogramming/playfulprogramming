import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { countContent } from "../utils/count-words";
import {PostInfo} from "uu-types";
import { dataDirectory, getDatas } from "./get-datas";
import {
  pickDeep,
  DeepPartial,
  DeepReplaceKeys,
  PickDeep,
} from "ts-util-helpers";

export const postsDirectory = join(process.cwd(), "content/blog");

const { unicorns, pronouns, licenses, roles } = getDatas();
export { unicorns, pronouns, licenses, roles, dataDirectory };

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

type KeysToPick = DeepPartial<DeepReplaceKeys<PostInfo, true | false>>;

export function getPostBySlug<ToPick extends KeysToPick>(
  slug: string,
  fields: ToPick = {} as any
): PickDeep<PostInfo, ToPick> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, realSlug, `index.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const counts = countContent(content) as {
    InlineCodeWords: number;
    RootNode: number;
    ParagraphNode: number;
    SentenceNode: number;
    WordNode: number;
    TextNode: number;
    WhiteSpaceNode: number;
    PunctuationNode: number;
    SymbolNode: number;
    SourceNode: number;
  };

  // Ensure only the minimal needed data is exposed
  const items = pickDeep(data, fields);

  if (fields.slug) {
    items.slug = realSlug;
  }
  if (fields.content) {
    items.content = content;
  }
  if (fields.wordCount) {
    items.wordCount = (counts.InlineCodeWords || 0) + (counts.WordNode || 0);
  }

  if (fields.authors) {
    items.authors = (data.authors as string[]).map(
      (author) => unicorns.find((unicorn) => unicorn.id === author)!
    );
  }

  return items as any;
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

export const getAllPostsForListView = () => {
  let allPosts = getAllPosts(
    {
      title: true,
      published: true,
      slug: true,
      authors: {
        firstName: true,
        lastName: true,
        id: true
      },
      excerpt: true,
    } as const,
    listViewCache
  );

  // sort posts by date in descending order
  allPosts = allPosts.sort((post1, post2) => {
    const date1 = new Date(post1.published);
    const date2 = new Date(post2.published);
    return date1 > date2 ? -1 : 1;
  });

  return allPosts;
};

export type ListViewPosts = ReturnType<typeof getAllPostsForListView>;
