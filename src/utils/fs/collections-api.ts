import fs from "fs";
import { collectionsDirectory, unicorns } from "utils/fs/get-datas";
import { isNotJunk } from "junk";
import { DeepPartial, DeepReplaceKeys, PickDeep } from "ts-util-helpers";
import { CollectionInfo } from "types/CollectionInfo";
import { PostInfo } from "types/PostInfo";
import { join } from "path";
import { readMarkdownFile } from "utils/fs/markdown-api";
import { getAllPosts } from "utils/fs/posts-api";
import { getImageSize } from "rehype-img-size";

export function getCollectionSlugs() {
  return fs.readdirSync(collectionsDirectory).filter(isNotJunk);
}

type KeysToPick = DeepPartial<DeepReplaceKeys<CollectionInfo>>;

const allPostsForCollectionQueryCache = {};

export function getCollectionBySlug<ToPick extends KeysToPick>(
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
      },
      allPostsForCollectionQueryCache
    );

    pickedData.posts = allPosts
      .filter((post) => post.series === pickedData.associatedSeries)
      .sort((a, b) => (a.order! < b.order! ? -1 : 1));
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

export function getAllCollections<ToPick extends KeysToPick>(
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
