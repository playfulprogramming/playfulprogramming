/**
 * This should rare-to-never be used inside of an `.astro` file, instead, please use Astro.glob
 *
 * This file is really only useful when we need to get a list of all posts with metadata associated
 * when the Astro runtime isn't available, such as getting suggested articles and other instances.
 */
import { rehypeUnicornPopulatePost } from "./markdown/rehype-unicorn-populate-post";
import { isNotJunk } from "junk";
import { postsDirectory } from "./data";
import { Languages, PostInfo } from "types/index";
import * as fs from "fs";
import * as path from "path";

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

export const getAllPosts = (lang: Languages): PostInfo[] => {
  const slugs = getPostSlugs(lang);
  return slugs.map(slug => {
    const file = {
      path: path.join(postsDirectory, slug, getIndexPath(lang)),
      data: {
        astro: {
          frontmatter: {},
        },
      },
    };

    (rehypeUnicornPopulatePost as any)()(undefined, file);

    return {
      ...(file.data.astro.frontmatter as any || {}).frontmatterBackup,
      ...file.data.astro.frontmatter
    };
  })
}
