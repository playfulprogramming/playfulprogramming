import type {
	CollectionInfo,
	PostInfo,
	RolesInfo,
	PersonInfo,
	TagInfo,
	SnitipInfo,
	PostVersion,
} from "#types/index.ts";
import { roles, people, posts, collections, tags, snitips } from "./data.ts";
import { isDefined } from "./is-defined.ts";
import {
	baseLocale,
	localizeHref,
	type Locale,
} from "#src/paraglide/runtime.js";
import { readPerson } from "./content/readPerson.ts";
import { readCollection } from "./content/readCollection.ts";
import { readPost } from "./content/readPost.ts";

function findLocalizedEntry<T extends { locale: Locale }>(
	locales: T[],
	language: Locale,
): T | undefined {
	return (
		locales.find((entry) => entry.locale === language) ??
		locales.find((entry) => entry.locale === baseLocale) ??
		locales[0]
	);
}

// stable sort for deterministic output. Windows need to sort by slug too since ordering of files isn't guaranteed
function compareByPublished<T extends { published: string; slug: string }>(
	obj1: T,
	obj2: T,
): number {
	return (
		Date.parse(obj2.published) - Date.parse(obj1.published) ||
		(obj1.slug < obj2.slug ? -1 : 1)
	);
}

function readAllByLang<
	Stub extends { locale: Locale },
	Info extends { published: string; slug: string },
>(entries: Map<string, Stub[]>, read: (stub: Stub) => Promise<Info>) {
	const byLocale = new Map<Locale, Promise<Info[]>>();
	return (language: Locale): Promise<Info[]> => {
		let result = byLocale.get(language);
		if (result === undefined) {
			result = Promise.all(
				[...entries.values()]
					.map((locales) => findLocalizedEntry(locales, language))
					.filter(isDefined)
					.map((stub) => read(stub)),
			).then((all) => all.sort(compareByPublished));
			byLocale.set(language, result);
		}
		return result;
	};
}

const allPostsByLang = readAllByLang(posts, readPost);
const allCollectionsByLang = readAllByLang(collections, readCollection);

export const getAllPosts = async (): Promise<PostInfo[]> => {
	return await Promise.all(
		[...posts.values()].flatMap((locales) => locales).map((p) => readPost(p)),
	);
};

export const getAllCollections = async (): Promise<CollectionInfo[]> => {
	return await Promise.all(
		[...collections.values()]
			.flatMap((locales) => locales)
			.map((c) => readCollection(c)),
	);
};

export const getAllPeople = async (): Promise<PersonInfo[]> => {
	return await Promise.all(
		[...people.values()]
			.flatMap((locales) => locales)
			.map((p) => readPerson(p)),
	);
};

export const getPersonById = async (
	id: string,
	language: Locale,
): Promise<PersonInfo | undefined> => {
	const locales = people.get(id);
	if (!locales) return undefined;
	const stub = findLocalizedEntry(locales, language);
	return stub ? await readPerson(stub) : undefined;
};

export const getPeopleByLang = async (
	language: Locale,
): Promise<PersonInfo[]> => {
	return await Promise.all(
		[...people.values()]
			.map((locales) => findLocalizedEntry(locales, language))
			.filter(isDefined)
			.map((p) => readPerson(p)),
	);
};

export const getPostBySlug = async (
	slug: string,
	language: Locale,
): Promise<PostInfo | undefined> => {
	const locales = posts.get(slug) || [];
	const stub = findLocalizedEntry(locales, language);
	return stub ? await readPost(stub) : undefined;
};

export const getPostsByLang = async (language: Locale): Promise<PostInfo[]> => {
	const postsByLang = await allPostsByLang(language);
	return postsByLang.filter((p) => !p.noindex);
};

export const getPostsByCollection = async (
	collectionSlug: string,
	language: Locale,
): Promise<PostInfo[]> => {
	const postsByCollection = (await allPostsByLang(language)).filter(
		(p) => p.collection === collectionSlug,
	);
	return postsByCollection.sort(
		(postA, postB) => Number(postA.order) - Number(postB.order),
	);
};

export const getPostVersionsBySlug = async (
	slug: string,
	language: Locale,
): Promise<PostVersion[]> => {
	const allPosts = await allPostsByLang(language);
	return allPosts
		.filter((p) => p?.upToDateSlug === slug || p.slug === slug)
		.map(({ locale, published, publishedMeta, slug, version }) => ({
			href: localizeHref(`/posts/${slug}`, { locale }),
			published,
			publishedMeta,
			version,
		}));
};

export const getPostsByPerson = async (
	personId: string,
	language: Locale,
): Promise<PostInfo[]> => {
	const allPosts = await allPostsByLang(language);
	return allPosts
		.filter((p) => p.authors.includes(personId))
		.filter((p) => !p.noindex);
};

export const getCollectionBySlug = async (
	slug: string,
	language: Locale,
): Promise<CollectionInfo | undefined> => {
	const locales = collections.get(slug) || [];
	const stub = findLocalizedEntry(locales, language);
	return stub ? await readCollection(stub) : undefined;
};

export const getCollectionsByLang = async (
	language: Locale,
): Promise<CollectionInfo[]> => {
	const collectionsByLang = await allCollectionsByLang(language);
	return collectionsByLang.filter((p) => !p.noindex);
};

export const getCollectionsByPerson = async (
	personId: string,
	language: Locale,
): Promise<CollectionInfo[]> => {
	const collectionsByLang = await allCollectionsByLang(language);
	return collectionsByLang
		.filter((c) => c.authors.includes(personId))
		.filter((p) => !p.noindex);
};

export function getRoleById(
	roleId: string,
	_language: Locale,
): RolesInfo | undefined {
	// TODO: support role name translations
	return roles.find((r) => r.id === roleId);
}

export function getTagById(tagId: string): TagInfo | undefined {
	return tags.get(tagId);
}

export function getSnitips(): SnitipInfo[] {
	return [...snitips.values()];
}

export function getSnitipById(snitipId: string): SnitipInfo | undefined {
	return snitips.get(snitipId);
}
