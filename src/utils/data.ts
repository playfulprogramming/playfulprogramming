import {
	LicenseInfo,
	PronounInfo,
	RawCollectionInfo,
	CollectionInfo,
	RolesEnum,
	UnicornInfo,
	RawPostInfo,
} from "types/index";
import * as fs from "fs";
import { join } from "path";
import { getImageSize } from "../utils/get-image-size";
import { getFullRelativePath } from "./url-paths";
import matter from "gray-matter";

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

function getPosts(): Array<RawPostInfo> {
	const slugs = fs.readdirSync(postsDirectory);
	return slugs.map((slug) => {
		const fileContents = fs.readFileSync(
			join(postsDirectory, slug, "index.md"),
			"utf8"
		);

		const frontmatter = matter(fileContents).data as RawPostInfo;

		return frontmatter;
	});
}

const posts = getPosts();

function getCollections(): Array<
	RawCollectionInfo & Pick<CollectionInfo, "slug" | "coverImgMeta">
> {
	const slugs = fs.readdirSync(collectionsDirectory);
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
