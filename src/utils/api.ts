import { PostInfo } from "types/index";
import { Languages } from "types/index";
import { posts } from "./data";

export function getPostsByLang(language: Languages): PostInfo[] {
	return posts.filter((p) => p.locale === language);
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
