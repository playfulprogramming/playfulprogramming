import {
	type SitemapItemLoose,
	EnumChangefreq,
	SitemapStream,
	streamToPromise,
} from "sitemap";
import * as api from "#utils/api.ts";
import { toDate } from "#utils/date.ts";
import type { PostInfo } from "#types/PostInfo.ts";
import type { CollectionInfo } from "#types/CollectionInfo.ts";
import { Readable } from "stream";
import { siteUrl } from "#src/constants/site-config.ts";
import { events } from "#src/views/events/constants/index.ts";
import {
	baseLocale,
	locales as configuredLocales,
	localizeHref,
	type Locale,
} from "#src/paraglide/runtime.js";

const About = (await import("./[...locale]/about.astro")) as unknown as {
	getStaticPaths: () => Promise<
		Array<{
			params: { locale?: Locale };
			props: { isFallback: boolean };
		}>
	>;
};

const sitemapDefaults: Pick<
	SitemapItemLoose,
	"lastmod" | "changefreq" | "priority"
> = {
	lastmod: new Date().toISOString(),
	changefreq: EnumChangefreq.DAILY,
	priority: 0.7,
};

const createLocaleUrl = (locale: Locale | undefined, path: string) =>
	localizeHref(path || "/", { locale: locale ?? baseLocale });

const createPostUrl = (locale: Locale, post: PostInfo) =>
	createLocaleUrl(locale, `/posts/${post.slug}`);

const createCollectionUrl = (locale: Locale, collection: CollectionInfo) =>
	createLocaleUrl(locale, `/collections/${collection.slug}`);

const includedRoutes = ["", "/join-us", "/search", "/events"];

const createLocaleLinks = (
	path: string,
	locales: readonly Locale[] = configuredLocales,
) =>
	locales.map((locale) => ({
		lang: locale,
		url: createLocaleUrl(locale, path),
	}));

export const GET = async () => {
	const entries: SitemapItemLoose[] = [];

	for (const path of includedRoutes) {
		for (const locale of configuredLocales) {
			entries.push({
				...sitemapDefaults,
				url: createLocaleUrl(locale, path),
				links: createLocaleLinks(path),
			});
		}
	}

	for (const event of events) {
		entries.push({
			...sitemapDefaults,
			url: `/events/${event.slug}`,
		});
	}

	const aboutPageLocales = (await About.getStaticPaths())
		.filter((page) => !page.props.isFallback)
		.map((page) => page.params.locale)
		.sort();
	for (const locale of aboutPageLocales) {
		entries.push({
			...sitemapDefaults,
			url: createLocaleUrl(locale, "/about"),
			links: aboutPageLocales.map((lang) => ({
				lang: lang ?? baseLocale,
				url: createLocaleUrl(lang, "/about"),
			})),
		});
	}

	for (const post of api.getAllPosts()) {
		if (post.noindex) continue;

		const links =
			post.locales.length > 1
				? [...post.locales].sort().map((lang) => ({
						lang,
						url: createPostUrl(lang, post),
					}))
				: undefined;

		entries.push({
			...sitemapDefaults,
			url: createPostUrl(post.locale, post),
			links,
			lastmod: toDate(post.edited ?? post.published).toISOString(),
		});
	}

	for (const collection of api.getAllCollections()) {
		if (collection.noindex) continue;

		const links =
			collection.locales.length > 1
				? [...collection.locales].sort().map((locale) => ({
						lang: locale,
						url: createCollectionUrl(locale, collection),
					}))
				: undefined;

		entries.push({
			...sitemapDefaults,
			url: createCollectionUrl(collection.locale, collection),
			links,
		});
	}

	const personLocalesById = new Map<string, Set<Locale>>();
	for (const person of api.getAllPeople()) {
		const locales = personLocalesById.get(person.id) ?? new Set<Locale>();
		for (const locale of person.locales) locales.add(locale);
		personLocalesById.set(person.id, locales);
	}

	for (const [personId, localeSet] of personLocalesById) {
		const path = `/people/${personId}`;
		const locales = [...localeSet].sort();
		const links =
			locales.length > 1 ? createLocaleLinks(path, locales) : undefined;

		for (const locale of locales) {
			entries.push({
				...sitemapDefaults,
				url: createLocaleUrl(locale, path),
				links,
			});
		}
	}

	// sort alphabetically to avoid changes between builds
	entries.sort((a, b) =>
		a.url.localeCompare(b.url, baseLocale, { numeric: true }),
	);

	const stream = new SitemapStream({
		hostname: siteUrl,
	});

	const sitemap = (
		await streamToPromise(Readable.from(entries).pipe(stream))
	).toString();
	return new Response(sitemap, {
		headers: { "Content-Type": "application/xml" },
	});
};
