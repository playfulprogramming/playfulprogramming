import type {
	CollectionInfo,
	PostInfo,
	RolesInfo,
	PersonInfo,
	PostVersion,
	Languages,
} from "#types/index.ts";
import { readCollection } from "./content/readCollection.ts";
import { readPerson } from "./content/readPerson.ts";
import { readPost } from "./content/readPost.ts";
import { roles, people, posts, collections } from "./data.ts";
import { isDefined } from "./is-defined.ts";

function compareByDate(date1: string, date2: string): number {
	return new Date(date1) > new Date(date2) ? -1 : 1;
}

function compareByPublished<T extends { published: string }>(
	obj1: T,
	obj2: T,
): number {
	return compareByDate(obj1.published, obj2.published);
}

function cache<Args extends string[], Ret>(
	callback: (...args: Args) => Promise<Ret>,
) {
	const map = new Map<string, Ret>();
	return async (...args: Args) => {
		const key = args.join("##");
		const ret = map.get(key);
		if (ret) return ret;

		const result = await callback(...args);
		map.set(key, result);
		return result;
	};
}

export const getAllPosts = cache(async (): Promise<PostInfo[]> => {
	return await Promise.all(
		[...posts.values()].flatMap((locales) => locales).map((p) => readPost(p)),
	);
});

export const getAllCollections = cache(async (): Promise<CollectionInfo[]> => {
	return await Promise.all(
		[...collections.values()]
			.flatMap((locales) => locales)
			.map((c) => readCollection(c)),
	);
});

export const getAllPeople = cache(async (): Promise<PersonInfo[]> => {
	return await Promise.all(
		[...people.values()]
			.flatMap((locales) => locales)
			.map((p) => readPerson(p)),
	);
});

export const getPersonById = cache(
	async (id: string, language: Languages): Promise<PersonInfo | undefined> => {
		const locales = people.get(id);
		if (!locales) return undefined;
		const stub = locales.find((u) => u.locale === language) || locales[0];
		return stub ? await readPerson(stub) : undefined;
	},
);

export const getPeopleByLang = cache(
	async (language: Languages): Promise<PersonInfo[]> => {
		return await Promise.all(
			[...people.values()]
				.map(
					(locales) => locales.find((p) => p.locale === language) || locales[0],
				)
				.filter(isDefined)
				.map((p) => readPerson(p)),
		);
	},
);

export const getPostBySlug = cache(
	async (slug: string, language: Languages): Promise<PostInfo | undefined> => {
		const locales = posts.get(slug) || [];
		const stub = locales.find((p) => p.locale === language) || locales[0];
		return stub ? await readPost(stub) : undefined;
	},
);

export const getPostsByLang = cache(
	async (language: Languages): Promise<PostInfo[]> => {
		const postsByLang = await Promise.all(
			[...posts.values()]
				.map(
					(locales) => locales.find((p) => p.locale === language) || locales[0],
				)
				.filter(isDefined)
				.map((p) => readPost(p)),
		);
		return postsByLang.filter((p) => !p.noindex).sort(compareByPublished);
	},
);

export const getPostsByCollection = cache(
	async (collectionSlug: string, language: Languages): Promise<PostInfo[]> => {
		const postsByCollection = await Promise.all(
			[...posts.values()]
				.map(
					(locales) => locales.find((p) => p.locale === language) || locales[0],
				)
				.filter((p) => p?.collection === collectionSlug)
				.map((p) => readPost(p)),
		);
		return postsByCollection.sort((postA, postB) =>
			Number(postA.order) > Number(postB.order) ? 1 : -1,
		);
	},
);

export const getPostVersionsBySlug = cache(
	async (slug: string, language: Languages): Promise<PostVersion[]> => {
		const allPosts = await Promise.all(
			[...posts.values()]
				.map(
					(locales) => locales.find((p) => p.locale === language) || locales[0],
				)
				.filter(isDefined)
				.map((p) => readPost(p)),
		);
		return allPosts
			.filter((p) => p?.upToDateSlug === slug || p.slug === slug)
			.sort(compareByPublished)
			.map(({ locale, publishedMeta, slug, version }) => ({
				href: locale === "en" ? `/posts/${slug}` : `/${locale}/posts/${slug}`,
				publishedMeta,
				version,
			}));
	},
);

export const getPostsByPerson = cache(
	async (personId: string, language: Languages): Promise<PostInfo[]> => {
		const allPosts = await Promise.all(
			[...posts.values()]
				.map(
					(locales) => locales.find((p) => p.locale === language) || locales[0],
				)
				.filter(isDefined)
				.map((p) => readPost(p)),
		);
		return allPosts
			.filter((p) => p.authors.includes(personId))
			.filter((p) => !p.noindex)
			.sort(compareByPublished);
	},
);

export const getCollectionBySlug = cache(
	async (
		slug: string,
		language: Languages,
	): Promise<CollectionInfo | undefined> => {
		const locales = collections.get(slug) || [];
		const stub = locales.find((c) => c.locale === language) || locales[0];
		return stub ? await readCollection(stub) : undefined;
	},
);

export const getCollectionsByLang = cache(
	async (language: Languages): Promise<CollectionInfo[]> => {
		const collectionsByLang = await Promise.all(
			[...collections.values()]
				.map(
					(locales) => locales.find((p) => p.locale === language) || locales[0],
				)
				.filter(isDefined)
				.map((c) => readCollection(c)),
		);
		return collectionsByLang.filter((p) => !p.noindex).sort(compareByPublished);
	},
);

export const getCollectionsByPerson = cache(
	async (personId: string, language: Languages): Promise<CollectionInfo[]> => {
		const collectionsByLang = await Promise.all(
			[...collections.values()]
				.map(
					(locales) => locales.find((p) => p.locale === language) || locales[0],
				)
				.filter(isDefined)
				.map((c) => readCollection(c)),
		);
		return collectionsByLang
			.filter((c) => c.authors.includes(personId))
			.filter((p) => !p.noindex)
			.sort(compareByPublished);
	},
);

export function getRoleById(
	roleId: string,
	_language: Languages,
): RolesInfo | undefined {
	// TODO: support role name translations
	return roles.find((r) => r.id === roleId);
}
