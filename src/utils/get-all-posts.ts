/**
 * This should rare-to-never be used inside of an `.astro` file, instead, please use Astro.glob
 *
 * This file is really only useful when we need to get a list of all posts with metadata associated
 * when the Astro runtime isn't available, such as getting suggested articles and other instances.
 */
import { rehypeUnicornPopulatePost } from "./markdown/rehype-unicorn-populate-post";
import { postsDirectory, posts } from "./data";
import { Languages, PostInfo } from "types/index";
import * as fs from "fs";
import * as path from "path";

const getIndexPath = (lang: Languages) => {
	const indexPath = lang !== "en" ? `index.${lang}.md` : `index.md`;
	return indexPath;
};

export function getPostSlugs(lang: Languages) {
	return [...getPosts(lang)].map((post) => post.slug);
}

export function* getPosts(lang: Languages) {
	for (const post of posts) {
		const indexFile = path.resolve(
			postsDirectory,
			post.slug,
			getIndexPath(lang)
		);
		if (!fs.existsSync(indexFile)) continue;

		const file = {
			path: indexFile,
			data: {
				astro: {
					frontmatter: {},
				},
			},
		};

		(rehypeUnicornPopulatePost as any)()(undefined, file);

		yield {
			...((file.data.astro.frontmatter as any) || {}).frontmatterBackup,
			...file.data.astro.frontmatter,
		};
	}
}

export const getAllPosts = (lang: Languages): PostInfo[] => {
	return [...getPosts(lang)];
};
