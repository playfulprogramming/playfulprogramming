/**
 * This should rare-to-never be used inside of an `.astro` file, instead, please use Astro.glob
 *
 * This file is really only useful when we need to get a list of all posts with metadata associated
 * when the Astro runtime isn't available, such as getting suggested articles and other instances.
 */
import { rehypeUnicornPopulatePost } from "./markdown/rehype-unicorn-populate-post";
import { postsDirectory, posts } from "./data";
import { Languages, ExtendedPostInfo } from "types/index";
import * as path from "path";

const getIndexPath = (lang: Languages) => {
	const indexPath = lang !== "en" ? `index.${lang}.md` : `index.md`;
	return indexPath;
};

export function getExtendedPost(
	slug: string,
	lang: Languages
): ExtendedPostInfo {
	const indexFile = path.resolve(postsDirectory, slug, getIndexPath(lang));
	const file = {
		path: indexFile,
		data: {
			astro: {
				frontmatter: {},
			},
		},
	};

	(rehypeUnicornPopulatePost as any)()(undefined, file);

	return {
		...((file.data.astro.frontmatter as any) || {}).frontmatterBackup,
		...file.data.astro.frontmatter,
	};
}

export function* getAllExtendedPosts(lang: Languages) {
	for (const post of posts) {
		if (post.locale !== lang) continue;

		yield getExtendedPost(post.slug, lang);
	}
}
