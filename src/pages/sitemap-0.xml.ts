import {
	type SitemapItemLoose,
	EnumChangefreq,
	SitemapStream,
	streamToPromise,
} from "sitemap";
import * as api from "#utils/api.ts";
import dayjs from "dayjs";
import type { PostInfo } from "#types/PostInfo.ts";
import type { CollectionInfo } from "#types/CollectionInfo.ts";
import type { Languages } from "#types/index.ts";
import { Readable } from "stream";
import { siteUrl } from "#src/constants/site-config.ts";
import { languages } from "#src/constants/index.ts";
import { events } from "#src/views/events/constants.ts";

const About = (await import("./[...locale]/about.astro")) as unknown as {
	getStaticPaths: () => Promise<
		Array<{
			params: { locale?: Languages };
			props: { isFallback: boolean };
		}>
	>;
};

const sitemapDefaults: Pick<
	SitemapItemLoose,
	"lastmod" | "changefreq" | "priority"
> = {
	lastmod: dayjs().toISOString(),
	changefreq: EnumChangefreq.DAILY,
	priority: 0.7,
};

const createLocaleUrl = (locale: Languages | undefined, path: string) =>
	`${locale && locale !== "en" ? `/${locale}` : ""}${path}`;

const createPostUrl = (locale: Languages, post: PostInfo) =>
	createLocaleUrl(locale, `/posts/${post.slug}`);

const createCollectionUrl = (locale: Languages, collection: CollectionInfo) =>
	createLocaleUrl(locale, `/collections/${collection.slug}`);

const includedRoutes = ["", "/join-us", "/search", "/events"];
const configuredLocales = Object.keys(languages) as Languages[];

const createLocaleLinks = (
	path: string,
	locales: Languages[] = configuredLocales,
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
				lang: lang ?? "en",
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
			lastmod: dayjs(post.edited ?? post.published).toISOString(),
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

	const personLocalesById = new Map<string, Set<Languages>>();
	for (const person of api.getAllPeople()) {
		const locales = personLocalesById.get(person.id) ?? new Set<Languages>();
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
	entries.sort((a, b) => a.url.localeCompare(b.url, "en", { numeric: true }));

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
