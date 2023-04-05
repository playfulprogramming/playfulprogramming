import { PostInfo } from "types/index";
import { Languages } from "types/index";
import { posts } from "./data";

export function getPostsByLang(language: Languages): PostInfo[] {
	let allPosts = posts.filter((p) => p.locale === language);

	// sort posts by date in descending order
	allPosts = allPosts.sort((post1, post2) => {
		const date1 = new Date(post1.published);
		const date2 = new Date(post2.published);
		return date1 > date2 ? -1 : 1;
	});

	return allPosts;
}

export function getPostsByUnicorn(
	authorId: string,
	language: Languages
): PostInfo[] {
	return getPostsByLang(language).filter((post) =>
		post.authors.find((postAuthor) => postAuthor === authorId)
	);
}

export function getPostsBySeries(
	series: string,
	language: Languages
): PostInfo[] {
	return getPostsByLang(language)
		.filter((post) => post.series === series)
		.sort((postA, postB) => (postA.order > postB.order ? 1 : -1));
}
