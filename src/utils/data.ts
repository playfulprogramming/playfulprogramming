import {
	RawCollectionInfo,
	ExtendedCollectionInfo,
	RolesEnum,
	UnicornInfo,
	RawPostInfo,
	PostInfo,
	Languages,
	CollectionInfo,
} from "types/index";
import * as fs from "fs";
import { join } from "path";
import { isNotJunk } from "junk";
import { getImageSize } from "../utils/get-image-size";
import { getFullRelativePath } from "./url-paths";
import matter from "gray-matter";
import dayjs from "dayjs";

export const postsDirectory = join(process.cwd(), "content/blog");
export const collectionsDirectory = join(process.cwd(), "content/collections");
export const dataDirectory = join(process.cwd(), "content/data");
export const siteDirectory = join(process.cwd(), "content/site");
export const sponsorsDirectory = join(process.cwd(), "public/sponsors");

const aboutRaw = (await import("../../content/data/about.json")).default;

const unicornsRaw = (await import("../../content/data/unicorns.json")).default;

const rolesRaw = (await import("../../content/data/roles.json")).default;

const pronounsRaw = (await import("../../content/data/pronouns.json")).default;

const licensesRaw = (await import("../../content/data/licenses.json")).default;

const fullUnicorns: UnicornInfo[] = unicornsRaw.map((unicorn) => {
	const absoluteFSPath = join(dataDirectory, unicorn.profileImg);
	/**
	 * `getFullRelativePath` strips all prefixing `/`, so we must add one manually
	 */
	const relativeServerPath = getFullRelativePath(
		"/content/data/",
		unicorn.profileImg
	);
	const profileImgSize = getImageSize(
		unicorn.profileImg,
		dataDirectory,
		dataDirectory
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
		(role) => rolesRaw.find((rRole) => rRole.id === role)! as RolesEnum
	);

	newUnicorn.pronounsMeta = pronounsRaw.find(
		(proWithNouns) => proWithNouns.id === unicorn.pronouns
	)!;

	return newUnicorn;
});

function getCollections(): Array<CollectionInfo> {
	const slugs = fs.readdirSync(collectionsDirectory).filter(isNotJunk);
	const collections = slugs.map((slug) => {
		const fileContents = fs.readFileSync(
			join(collectionsDirectory, slug, "index.md"),
			"utf8"
		);

		const frontmatter = matter(fileContents).data as RawCollectionInfo;

		const coverImgSize = getImageSize(
			frontmatter.coverImg,
			join(collectionsDirectory, slug),
			join(collectionsDirectory, slug)
		);

		const coverImgMeta = {
			height: coverImgSize.height as number,
			width: coverImgSize.width as number,
			relativePath: frontmatter.coverImg,
			relativeServerPath: getFullRelativePath(
				`/content/collections/${slug}`,
				frontmatter.coverImg
			),
			absoluteFSPath: join(collectionsDirectory, slug, frontmatter.coverImg),
		};

		const authorsMeta = frontmatter.authors.map((authorId) =>
			fullUnicorns.find((u) => u.id === authorId)
		);

		return {
			...(frontmatter as RawCollectionInfo),
			slug,
			coverImgMeta,
			authorsMeta,
		};
	});
	return collections;
}

const collections = getCollections();

function getPosts(): Array<PostInfo> {
	const slugs = fs.readdirSync(postsDirectory).filter(isNotJunk);
	return slugs.flatMap((slug) => {
		const files = fs
			.readdirSync(join(postsDirectory, slug))
			.filter(isNotJunk)
			.filter((name) => name.startsWith("index.") && name.endsWith(".md"));

		const locales = files
			.map((name) => name.split(".").at(-2))
			.map((lang) => (lang === "index" ? "en" : lang) as Languages);

		return files.map((file, i) => {
			const fileContents = fs.readFileSync(
				join(postsDirectory, slug, file),
				"utf8"
			);

			const frontmatter = matter(fileContents).data as RawPostInfo;

			return {
				...frontmatter,
				slug,
				locales,
				locale: locales[i],
				authorsMeta: frontmatter.authors.map((authorId) =>
					fullUnicorns.find((u) => u.id === authorId)
				),
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
					frontmatter.series &&
					collections.find((c) => c.slug === frontmatter.series),
			};
		});
	});
}

const posts = getPosts();

const tags = [
	...posts.reduce((set, post) => {
		for (const tag of post.tags || []) set.add(tag);

		return set;
	}, new Set<string>()),
];

export {
	aboutRaw as about,
	fullUnicorns as unicorns,
	rolesRaw as roles,
	pronounsRaw as pronouns,
	licensesRaw as licenses,
	collections,
	posts,
	tags,
};
