import { CollectionInfo, PostInfo } from "types/index";
import { Languages } from "types/index";
import { posts, collections } from "./data";

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

export function getPostsByCollection(
	collection: string,
	language: Languages
): PostInfo[] {
	return getPostsByLang(language)
		.filter((post) => post.collection === collection)
		.sort((postA, postB) => (postA.order > postB.order ? 1 : -1));
}

export function getCollectionsByLang(language: Languages): CollectionInfo[] {
	return collections.filter((c) => c.locale === language);
}
