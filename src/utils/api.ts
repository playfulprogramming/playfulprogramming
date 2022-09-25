import { PostInfo } from "types/PostInfo";
import { Languages } from "types/index";
import { MarkdownInstance } from "astro";

const allPostsCache = new WeakMap<object, MarkdownInstance<PostInfo>[]>();

export function getAllPosts(
	posts: MarkdownInstance<PostInfo>[],
	language: Languages,
	cacheString: null | object = null
): MarkdownInstance<PostInfo>[] {
	if (cacheString) {
		const cacheData = allPostsCache.get(cacheString);
		if (cacheData) return cacheData as any;
	}

	if (cacheString) allPostsCache.set(cacheString, posts);

	return posts.filter((post) => post.frontmatter.locale === language);
}

const listViewCache = {};

export const getAllPostsForListView = (
	posts: MarkdownInstance<PostInfo>[],
	language: Languages
): PostInfo[] => {
	let allPosts = getAllPosts(posts, language, listViewCache);

	// sort posts by date in descending order
	allPosts = allPosts.sort((post1, post2) => {
		const date1 = new Date(post1.frontmatter.published);
		const date2 = new Date(post2.frontmatter.published);
		return date1 > date2 ? -1 : 1;
	});

	return allPosts
		.map((post) => post.frontmatter)
		.filter((post) => post.locale === language);
};

export const getAllPostsForUnicornListView = (
	authorId: string,
	posts: MarkdownInstance<PostInfo>[],
	language: Languages
): PostInfo[] => {
	return getAllPostsForListView(posts, language).filter((post) =>
		post.authorsMeta.find((postAuthor) => postAuthor.id === authorId)
	);
};
