import {
	RawCollectionInfo,
	RolesEnum,
	UnicornInfo,
	RawPostInfo,
	PostInfo,
	Languages,
	CollectionInfo,
	ExtendedPostInfo,
} from "types/index";
import * as fs from "fs";
import { join } from "path";
import { isNotJunk } from "junk";
import { getImageSize } from "../utils/get-image-size";
import { getFullRelativePath } from "./url-paths";
import matter from "gray-matter";
import dayjs from "dayjs";
import collectionMapping from "../../content/data/collection-mapping";

export const postsDirectory = join(process.cwd(), "content/blog");
export const collectionsDirectory = join(process.cwd(), "content/collections");
export const dataDirectory = join(process.cwd(), "content/data");
export const siteDirectory = join(process.cwd(), "content/site");
export const sponsorsDirectory = join(process.cwd(), "public/sponsors");

const aboutRaw = (await import("../../content/data/about.json")).default;

const unicornsRaw = (await import("../../content/data/unicorns.json")).default;

const rolesRaw = (await import("../../content/data/roles.json")).default;

const licensesRaw = (await import("../../content/data/licenses.json")).default;

const fullUnicorns: UnicornInfo[] = unicornsRaw.map((unicorn) => {
	const absoluteFSPath = join(dataDirectory, unicorn.profileImg);
	/**
	 * `getFullRelativePath` strips all prefixing `/`, so we must add one manually
	 */
	const relativeServerPath = getFullRelativePath(
		"/content/data/",
		unicorn.profileImg,
	);
	const profileImgSize = getImageSize(
		unicorn.profileImg,
		dataDirectory,
		dataDirectory,
	);

	// Mutation go BRR
	const newUnicorn: UnicornInfo = unicorn as never;

	newUnicorn.profileImgMeta = {
		height: profileImgSize.height as number,
		width: profileImgSize.width as number,
		relativePath: unicorn.profileImg,
		relativeServerPath,
		absoluteFSPath,
	};

	newUnicorn.rolesMeta = unicorn.roles.map(
		(role) => rolesRaw.find((rRole) => rRole.id === role)! as RolesEnum,
	);

	// normalize social links - if a URL or "@name" is entered, only preserve the last part
	const normalizeUsername = (username: string | undefined) =>
		username?.trim()?.replace(/^.*[/@](?!$)/, "");

	newUnicorn.socials.twitter = normalizeUsername(newUnicorn.socials.twitter);
	newUnicorn.socials.github = normalizeUsername(newUnicorn.socials.github);
	newUnicorn.socials.linkedIn = normalizeUsername(newUnicorn.socials.linkedIn);
	newUnicorn.socials.twitch = normalizeUsername(newUnicorn.socials.twitch);
	newUnicorn.socials.dribbble = normalizeUsername(newUnicorn.socials.dribbble);

	return newUnicorn;
});

function getCollections(): CollectionInfo[] {
	const slugs = fs.readdirSync(collectionsDirectory).filter(isNotJunk);
	const collections = slugs.flatMap((slug) => {
		const files = fs
			.readdirSync(join(collectionsDirectory, slug))
			.filter(isNotJunk)
			.filter((name) => name.startsWith("index.") && name.endsWith(".md"));

		const locales = files
			.map((name) => name.split(".").at(-2))
			.map((lang) => (lang === "index" ? "en" : lang) as Languages);

		return files.map((file, i): CollectionInfo => {
			const fileContents = fs.readFileSync(
				join(collectionsDirectory, slug, file),
				"utf8",
			);

			const frontmatter = matter(fileContents).data as RawCollectionInfo;

			const coverImgSize = getImageSize(
				frontmatter.coverImg,
				join(collectionsDirectory, slug),
				join(collectionsDirectory, slug),
			);

			const coverImgMeta = {
				height: coverImgSize.height as number,
				width: coverImgSize.width as number,
				relativePath: frontmatter.coverImg,
				relativeServerPath: getFullRelativePath(
					`/content/collections/${slug}`,
					frontmatter.coverImg,
				),
				absoluteFSPath: join(collectionsDirectory, slug, frontmatter.coverImg),
			};

			const authorsMeta = frontmatter.authors.map((authorId) =>
				fullUnicorns.find((u) => u.id === authorId),
			);

			return {
				...(frontmatter as RawCollectionInfo),
				slug,
				locales,
				locale: locales[i],
				coverImgMeta,
				authorsMeta,
			} as Omit<CollectionInfo, "posts"> as CollectionInfo;
		});
	});

	const collectionMappingFilled = collectionMapping.map((collection) => {
		const { slug, ...frontmatter } = collection;

		const coverImgSize = getImageSize(
			frontmatter.coverImg,
			join(process.cwd(), "public"),
			join(process.cwd(), "public"),
		);

		const coverImgMeta = {
			height: coverImgSize.height as number,
			width: coverImgSize.width as number,
			relativePath: frontmatter.coverImg,
			relativeServerPath: frontmatter.coverImg,
			absoluteFSPath: join(process.cwd(), "public", frontmatter.coverImg),
		};

		const authorsMeta = frontmatter.authors.map((authorId) =>
			fullUnicorns.find((u) => u.id === authorId),
		);

		return {
			...(frontmatter as RawCollectionInfo),
			slug,
			// TODO: Add locales to collection-mapping.ts
			locales: ["en"],
			locale: "en",
			coverImgMeta,
			authorsMeta,
		} as Omit<CollectionInfo, "posts"> as CollectionInfo;
	});

	const allCollections = collections.concat(collectionMappingFilled);

	// sort posts by date in descending order
	allCollections.sort((collection1, collection2) => {
		const date1 = new Date(collection1.published);
		const date2 = new Date(collection2.published);
		return date1 > date2 ? -1 : 1;
	});

	return allCollections;
}

let collections = getCollections();

function getPosts(): Array<PostInfo> {
	const slugs = fs.readdirSync(postsDirectory).filter(isNotJunk);
	const posts = slugs.flatMap((slug) => {
		const files = fs
			.readdirSync(join(postsDirectory, slug))
			.filter(isNotJunk)
			.filter((name) => name.startsWith("index.") && name.endsWith(".md"));

		const locales = files
			.map((name) => name.split(".").at(-2))
			.map((lang) => (lang === "index" ? "en" : lang) as Languages);

		return files.map((file, i): PostInfo => {
			const fileContents = fs.readFileSync(
				join(postsDirectory, slug, file),
				"utf8",
			);

			const frontmatter = matter(fileContents).data as RawPostInfo;

			// Look... Okay? Just.. Look.
			// Yes, we could use rehypeRetext and then XYZW but jeez there's so many edgecases.

			/**
			 * An ode to words
			 *
			 * Oh words, what can be said of thee?
			 *
			 * Not much me.
			 *
			 * See, it's conceived that ye might have intriguing definitions from one-to-another
			 *
			 * This is to say: "What is a word?"
			 *
			 * An existential question at best, a sisyphean effort at worst.
			 *
			 * See, while `forms` and `angular` might be considered one word each: what of `@angular/forms`? Is that 2?
			 *
			 * Or, what of `@someone mentioned Angular's forms`? Is that 4?
			 *
			 * This is a long-winded way of saying "We know our word counter is inaccurate, but so is yours."
			 *
			 * Please do let us know if you have strong thoughts/answers on the topic,
			 * we're happy to hear them.
			 */
			const wordCount = fileContents.split(/\s+/).length;

			return {
				...frontmatter,
				slug,
				locales,
				locale: locales[i],
				authorsMeta: frontmatter.authors.map((authorId) =>
					fullUnicorns.find((u) => u.id === authorId),
				),
				wordCount: wordCount,
				publishedMeta:
					frontmatter.published &&
					dayjs(frontmatter.published).format("MMMM D, YYYY"),
				editedMeta:
					frontmatter.edited &&
					dayjs(frontmatter.edited).format("MMMM D, YYYY"),
				licenseMeta:
					frontmatter.license &&
					licensesRaw.find((l) => l.id === frontmatter.license),
				collectionMeta:
					frontmatter.collection &&
					collections.find((c) => c.slug === frontmatter.collection),
				socialImg: `/generated/${slug}.twitter-preview.jpg`,
			};
		});
	});

	// sort posts by date in descending order
	posts.sort((post1, post2) => {
		const date1 = new Date(post1.published);
		const date2 = new Date(post2.published);
		return date1 > date2 ? -1 : 1;
	});

	// calculate whether each post should have a banner image
	const paginationCount: Partial<Record<Languages, number>> = {};
	for (const post of posts) {
		// total count of posts per locale
		const count = (paginationCount[post.locale] =
			paginationCount[post.locale] + 1 || 0);
		// index of the post on its page (assuming the page is paginated by 8)
		const index = count % 8;
		// if the post is at index 0 or 4, it should have a banner
		if (index === 0 || index === 4)
			post.bannerImg = `/generated/${post.slug}.banner.jpg`;
	}

	return posts;
}

const posts = getPosts();

collections = collections.map((collection: Omit<CollectionInfo, "posts">) => ({
	...collection,
	posts: posts.filter((post) => post.collection === collection.slug),
})) as CollectionInfo[];

const tags = [
	...[...posts, ...collections].reduce((set, item) => {
		for (const tag of item.tags || []) set.add(tag);

		return set;
	}, new Set<string>()),
];

export {
	aboutRaw as about,
	fullUnicorns as unicorns,
	rolesRaw as roles,
	licensesRaw as licenses,
	collections,
	posts,
	tags,
};
