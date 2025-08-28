import {
	EnumChangefreq,
	SitemapItemLoose,
	SitemapStream,
	streamToPromise,
} from "sitemap";
import * as api from "utils/api";
import dayjs from "dayjs";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";
import { Languages } from "types/index";
import * as About from "./[...locale]/about.astro";
import { Readable } from "stream";
import { siteUrl } from "constants/site-config";

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

const includedRoutes = ["", "/join-us", "/search"];

export const GET = async () => {
	const entries: SitemapItemLoose[] = [];

	for (const path of includedRoutes) {
		entries.push({
			...sitemapDefaults,
			url: path,
		});
	}

	const aboutPageLocales = (await About.getStaticPaths())
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
		if (post.noindex || post.originalLink) continue;

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

	for (const person of api.getAllPeople()) {
		entries.push({
			...sitemapDefaults,
			url: `/people/${person.id}`,
		});
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
