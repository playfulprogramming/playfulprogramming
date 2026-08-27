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

function compareByDate(date1: string, date2: string): number {
	return new Date(date1) > new Date(date2) ? -1 : 1;
}

function compareByPublished<T extends { published: string }>(
	obj1: T,
	obj2: T,
): number {
	return compareByDate(obj1.published, obj2.published);
}

export function getAllPosts(): PostInfo[] {
	return [...posts.values()].flatMap((locales) => locales);
}

export function getAllCollections(): CollectionInfo[] {
	return [...collections.values()].flatMap((locales) => locales);
}

export function getAllPeople(): PersonInfo[] {
	return [...people.values()].flatMap((locales) => locales);
}

export function getPersonById(
	id: string,
	language: Locale,
): PersonInfo | undefined {
	const locales = people.get(id);
	if (!locales) return undefined;
	return findLocalizedEntry(locales, language);
}

export function getPeopleByLang(language: Locale): PersonInfo[] {
	return [...people.values()]
		.map((locales) => findLocalizedEntry(locales, language))
		.filter(isDefined);
}

export function getPostBySlug(
	slug: string,
	language: Locale,
): PostInfo | undefined {
	const locales = posts.get(slug) || [];
	return findLocalizedEntry(locales, language);
}

export function getPostsByLang(language: Locale): PostInfo[] {
	return [...posts.values()]
		.map((locales) => findLocalizedEntry(locales, language))
		.filter(isDefined)
		.filter((p) => !p.noindex)
		.sort(compareByPublished);
}

export function getPostsByCollection(
	collectionSlug: string,
	language: Locale,
): PostInfo[] {
	return [...posts.values()]
		.map((locales) => findLocalizedEntry(locales, language))
		.filter(isDefined)
		.filter((p) => p.collection === collectionSlug)
		.sort((postA, postB) =>
			Number(postA.order) > Number(postB.order) ? 1 : -1,
		);
}

export function getPostVersionsBySlug(
	slug: string,
	language: Locale,
): PostVersion[] {
	return [...posts.values()]
		.map((locales) => findLocalizedEntry(locales, language))
		.filter(isDefined)
		.filter((p) => p.upToDateSlug === slug || p.slug === slug)
		.sort(compareByPublished)
		.map(({ locale, publishedMeta, slug, version }) => ({
			href: localizeHref(`/posts/${slug}`, { locale }),
			publishedMeta,
			version,
		}));
}

export function getPostsByPerson(
	personId: string,
	language: Locale,
): PostInfo[] {
	return [...posts.values()]
		.map((locales) => findLocalizedEntry(locales, language))
		.filter(isDefined)
		.filter((p) => p.authors.includes(personId))
		.filter((p) => !p.noindex)
		.sort(compareByPublished);
}

export function getCollectionBySlug(
	slug: string,
	language: Locale,
): CollectionInfo | undefined {
	const locales = collections.get(slug) || [];
	return findLocalizedEntry(locales, language);
}

export function getCollectionsByLang(language: Locale): CollectionInfo[] {
	return [...collections.values()]
		.map((locales) => findLocalizedEntry(locales, language))
		.filter(isDefined)
		.filter((p) => !p.noindex)
		.sort(compareByPublished);
}

export function getCollectionsByPerson(
	personId: string,
	language: Locale,
): CollectionInfo[] {
	return [...collections.values()]
		.map((locales) => findLocalizedEntry(locales, language))
		.filter(isDefined)
		.filter((c) => c.authors.includes(personId))
		.filter((p) => !p.noindex)
		.sort(compareByPublished);
}

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
