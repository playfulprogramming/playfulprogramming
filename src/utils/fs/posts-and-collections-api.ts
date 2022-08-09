import {
  unicorns,
  licenses,
} from "utils/fs/get-datas";
import { PostInfo } from "types/PostInfo";
import { getExcerpt } from "utils/markdown/getExcerpt";
import { Languages } from "types/index";
import { MarkdownInstance } from "astro";

// const getIndexPath = (lang: Languages) => {
//   const indexPath = lang !== "en" ? `index.${lang}.md` : `index.md`;
//   return indexPath;
// };

export function extendPostMetadata(
  post: MarkdownInstance<PostInfo>
) {
  // Split based on `/`, even in Windows
  const directorySplit = post.file.split('/');

  // This is the folder name, AKA how we generate the slug ID
  const slug = directorySplit.at(-2);
 
  /** Calculate post locale */
  // index.md or index.es.md
  const indexName = directorySplit.at(-1);
  const indexSplit = indexName.split('.');
  let locale = indexSplit.at(-2);
  if (locale === 'index') {
    locale = 'en';
  }

  // // TODO: Add translations
  // if (fields.translations) {
  //   const langsToQuery: Languages[] = Object.keys(languages).filter(
  //     (l) => l !== lang
  //   ) as never;
  //   pickedData.translations = langsToQuery
  //     .filter((lang) =>
  //       fs.existsSync(resolve(dirname(fullPath), getIndexPath(lang)))
  //     )
  //     .reduce((prev, lang) => {
  //       prev[lang] = languages[lang];
  //       return prev;
  //     }, {} as Record<Languages, string>);
  // }

  // // TODO: Add collection slug
  // if (fields.collectionSlug) {
  //   if (frontmatterData.series) {
  //     pickedData.collectionSlug = collectionsByName.find(
  //       (collection) => collection.associatedSeries === frontmatterData.series
  //     )?.slug;
  //   }
  //   if (!pickedData.collectionSlug) pickedData.collectionSlug = null;
  // }

  const authors = (post.frontmatter.authors as never as string[]).map(
    (author) => unicorns.find((unicorn) => unicorn.id === author)!
  );

  let license;
  if (post.frontmatter.license) {
    license = licenses.find(
      (l) => l.id === post.frontmatter.license as never as string
    );
  }
  if (!license) license = null;

  return {
    ...post.frontmatter,
    Content: post.Content,
    slug,
    locale,
    authors,
    license
  } as PostInfo;
}

let allPostsCache = new WeakMap<object, PostInfo[]>();

export function getAllPosts(
  posts: MarkdownInstance<PostInfo>[],
  language: Languages,
  cacheString: null | object = null
) {
  if (cacheString) {
    const cacheData = allPostsCache.get(cacheString);
    if (cacheData) return cacheData as any;
  }

  // TODO: Move `Astro.glob` here
  // const posts = await Astro.glob<PostInfo>('../../content/blog/**/*.md')

  const newPosts = posts
  .map(post => extendPostMetadata(post));
  
  if (cacheString) allPostsCache.set(cacheString, newPosts);

  return newPosts
  .filter(post => post.locale === language);
}

const listViewCache = {};

export const getAllPostsForListView = (
  posts: MarkdownInstance<PostInfo>[],
  language: Languages,
): PostInfo[] => {
  let allPosts = getAllPosts(posts, language, listViewCache);

  // sort posts by date in descending order
  allPosts = allPosts.sort((post1, post2) => {
    const date1 = new Date(post1.published);
    const date2 = new Date(post2.published);
    return date1 > date2 ? -1 : 1;
  });

  return allPosts;
};
