import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { countContent } from "utils/count-words";
import { PostInfo } from "uu-types";
import {
  dataDirectory,
  unicorns,
  pronouns,
  licenses,
  roles,
  postsDirectory,
} from "./get-datas";
import {
  pickDeep,
  DeepPartial,
  DeepReplaceKeys,
  PickDeep,
} from "ts-util-helpers";

export { unicorns, pronouns, licenses, roles, dataDirectory, postsDirectory };

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

type KeysToPick = DeepPartial<DeepReplaceKeys<PostInfo>>;

interface MarkdownAdditions {
  content: string;
  wordCount: number;
}

export function readMarkdownFile<
  T,
  ToPick extends DeepPartial<
    DeepReplaceKeys<T & MarkdownAdditions>
  > = DeepPartial<DeepReplaceKeys<T & MarkdownAdditions>>
>(
  filePath: string,
  fields: ToPick
): {
  frontmatterData: Record<string, any>;
  pickedData: PickDeep<T & MarkdownAdditions, ToPick>;
} {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data: frontmatterData, content } = matter(fileContents);
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
  const pickedData = pickDeep(
    frontmatterData,
    fields as DeepReplaceKeys<typeof frontmatterData>
  );

  if (fields.content) {
    pickedData.content = content;
  }
  if (fields.wordCount) {
    pickedData.wordCount =
      (counts.InlineCodeWords || 0) + (counts.WordNode || 0);
  }

  return {
    frontmatterData,
    pickedData: pickedData as any,
  };
}

export function getPostBySlug<ToPick extends KeysToPick>(
  slug: string,
  fields: ToPick = {} as any
): PickDeep<PostInfo, ToPick> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, realSlug, `index.md`);
  const { frontmatterData, pickedData } = readMarkdownFile(fullPath, fields);

  if (fields.slug) {
    pickedData.slug = realSlug;
  }

  if (fields.authors) {
    pickedData.authors = (frontmatterData.authors as string[]).map(
      (author) => unicorns.find((unicorn) => unicorn.id === author)!
    );
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

export const getAllPostsForListView = () => {
  let allPosts = getAllPosts(
    {
      title: true,
      published: true,
      slug: true,
      authors: {
        firstName: true,
        lastName: true,
        id: true,
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
