import * as fs from "fs";
import * as path from "path";
import {
  collectionsDirectory,
  postsDirectory,
  unicorns,
  licenses,
} from "utils/fs/get-datas";
import { isNotJunk } from "junk";
import { DeepPartial, DeepReplaceKeys, PickDeep } from "ts-util-helpers";
import { CollectionInfo } from "types/CollectionInfo";
import { PostInfo } from "types/PostInfo";
import { join, dirname, resolve } from "path";
import { readMarkdownFile } from "utils/fs/markdown-api";
import { getImageSize } from "rehype-img-size";
import { getExcerpt } from "utils/markdown/getExcerpt";
import { Languages } from "types/index";
import { languages } from "constants/index";

export function getCollectionSlugs() {
  return fs.readdirSync(collectionsDirectory).filter(isNotJunk);
}

type CollectionKeysToPick = DeepPartial<DeepReplaceKeys<CollectionInfo>>;

const allPostsForCollectionQueryCache = {};

export function getCollectionBySlug<ToPick extends CollectionKeysToPick>(
  slug: string,
  fields: ToPick = {} as any
): PickDeep<CollectionInfo, ToPick> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(collectionsDirectory, realSlug, `index.md`);
  const { frontmatterData, pickedData } = readMarkdownFile(fullPath, fields);

  if (fields.slug) {
    pickedData.slug = realSlug;
  }

  if (fields.authors) {
    pickedData.authors = (frontmatterData.authors as string[]).map(
      (author) => unicorns.find((unicorn) => unicorn.id === author)!
    );
  }

  if (fields.posts) {
    const allPosts = getAllPosts(
      {
        description: true,
        excerpt: true,
        title: true,
        series: true,
        order: true,
        slug: true,
        authors: true,
        content: true,
      },
      "en",
      allPostsForCollectionQueryCache
    );

    pickedData.posts = allPosts
      .filter((post) => post.series === pickedData.associatedSeries)
      .sort((a, b) => (a.order! < b.order! ? -1 : 1));
  }

  if (fields.aboveFoldMarkdown) {
    if (pickedData.aboveFoldMarkdown) {
      const { content } = readMarkdownFile(
        join(collectionsDirectory, realSlug, pickedData.aboveFoldMarkdown),
        { content: true }
      );
      pickedData.aboveFoldMarkdown = content;
    } else {
      pickedData.aboveFoldMarkdown = null;
    }
  }

  if (fields.coverImg) {
    const absoluteFSPath = join(
      collectionsDirectory,
      slug,
      pickedData.coverImg
    );
    const profileImgSize = getImageSize(absoluteFSPath);
    pickedData.coverImg = {
      height: profileImgSize.height,
      width: profileImgSize.width,
      relativePath: pickedData.coverImg,
    };
  }

  return pickedData as any;
}

let allCollectionsCache = new WeakMap<object, CollectionInfo[]>();

export function getAllCollections<ToPick extends CollectionKeysToPick>(
  fields: ToPick = {} as any,
  cacheString: null | object = null
): Array<PickDeep<PostInfo, ToPick>> {
  if (cacheString) {
    const cacheData = allCollectionsCache.get(cacheString);
    if (cacheData) return cacheData as any;
  }

  const slugs = getCollectionSlugs();
  const collections = slugs.map((slug) => getCollectionBySlug(slug, fields));

  if (cacheString)
    allCollectionsCache.set(
      cacheString,
      collections as never as CollectionInfo[]
    );

  return collections as any[];
}

const getIndexPath = (lang: Languages) => {
  const indexPath = lang !== "en" ? `index.${lang}.md` : `index.md`;
  return indexPath;
};

export function getPostSlugs(lang: Languages) {
  // Avoid errors trying to read from `.DS_Store` files
  return fs
    .readdirSync(postsDirectory)
    .filter(isNotJunk)
    .filter((dir) =>
      fs.existsSync(path.resolve(postsDirectory, dir, getIndexPath(lang)))
    );
}

type PostKeysToPick = DeepPartial<DeepReplaceKeys<PostInfo>>;

const collectionsByName = getAllCollections({
  slug: true,
  associatedSeries: true,
});

export function getPostBySlug<ToPick extends PostKeysToPick>(
  slug: string,
  lang: Languages,
  fields: ToPick = {} as any
): PickDeep<PostInfo, ToPick> {
  const realSlug = slug.replace(/\.md$/, "");
  const indexPath = getIndexPath(lang);
  const fullPath = join(postsDirectory, realSlug, indexPath);
  const { frontmatterData, pickedData, content } = readMarkdownFile(
    fullPath,
    fields
  );

  if (fields.slug) {
    pickedData.slug = realSlug;
  }

  if (fields.translations) {
    const langsToQuery: Languages[] = Object.keys(languages).filter(
      (l) => l !== lang
    ) as never;
    pickedData.translations = langsToQuery
      .filter((lang) =>
        fs.existsSync(resolve(dirname(fullPath), getIndexPath(lang)))
      )
      .reduce((prev, lang) => {
        prev[lang] = languages[lang];
        return prev;
      }, {} as Record<Languages, string>);
  }

  if (fields.collectionSlug) {
    if (frontmatterData.series) {
      pickedData.collectionSlug = collectionsByName.find(
        (collection) => collection.associatedSeries === frontmatterData.series
      )?.slug;
    }
    if (!pickedData.collectionSlug) pickedData.collectionSlug = null;
  }

  if (fields.authors) {
    pickedData.authors = (frontmatterData.authors as string[]).map(
      (author) => unicorns.find((unicorn) => unicorn.id === author)!
    );
  }

  if (fields.license) {
    if (frontmatterData.license) {
      pickedData.license = licenses.find(
        (l) => l.id === frontmatterData.license
      );
    }
    if (!pickedData.license) pickedData.license = null;
  }

  if (fields.excerpt) {
    pickedData.excerpt = getExcerpt(content);
  }

  return pickedData as any;
}

let allPostsCache = new WeakMap<object, PostInfo[]>();

export function getAllPosts<ToPick extends PostKeysToPick>(
  fields: ToPick = {} as any,
  language: Languages,
  cacheString: null | object = null
): Array<PickDeep<PostInfo, ToPick>> {
  if (cacheString) {
    const cacheData = allPostsCache.get(cacheString);
    if (cacheData) return cacheData as any;
  }

  const slugs = getPostSlugs(language);
  const posts = slugs.map((slug) => getPostBySlug(slug, language, fields));

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
  let allPosts = getAllPosts(listViewPostQuery, "en", listViewCache);

  // sort posts by date in descending order
  allPosts = allPosts.sort((post1, post2) => {
    const date1 = new Date(post1.published);
    const date2 = new Date(post2.published);
    return date1 > date2 ? -1 : 1;
  });

  return allPosts;
};

export type ListViewPosts = ReturnType<typeof getAllPostsForListView>;

export const collectionQuery = {
  associatedSeries: true,
  posts: {
    description: true,
    excerpt: true,
    title: true,
    order: true,
    series: true,
    slug: true,
    authors: {
      name: true,
      id: true,
    },
  },
  title: true,
  authors: {
    socials: true,
    name: true,
    lastName: true,
    firstName: true,
    id: true,
  },
  description: true,
  content: true,
  slug: true,
  coverImg: true,
  buttons: true,
  published: true,
  type: true,
  chapterList: true,
  socialImg: true,
  aboveFoldMarkdown: true,
} as const;

export type CollectionQueryType = PickDeep<
  CollectionInfo,
  typeof collectionQuery
>;
