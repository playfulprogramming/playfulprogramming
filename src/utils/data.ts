import {
	LicenseInfo,
	PronounInfo,
	RawCollectionInfo,
	RolesEnum,
	UnicornInfo,
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

const unicornsRaw: Array<
	Omit<UnicornInfo, "roles" | "pronouns" | "profileImg"> & {
		roles: string[];
		pronouns: string;
		profileImg: string;
	}
> = JSON.parse(
	fs.readFileSync(join(dataDirectory, "unicorns.json")).toString()
);

const rolesRaw: RolesEnum[] = JSON.parse(
	fs.readFileSync(join(dataDirectory, "roles.json")).toString()
);

const pronounsRaw: PronounInfo[] = JSON.parse(
	fs.readFileSync(join(dataDirectory, "pronouns.json")).toString()
);

const licensesRaw: LicenseInfo[] = JSON.parse(
	fs.readFileSync(join(dataDirectory, "licenses.json")).toString()
);

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
		(role) => rolesRaw.find((rRole) => rRole.id === role)!
	);

	newUnicorn.pronounsMeta = pronounsRaw.find(
		(proWithNouns) => proWithNouns.id === unicorn.pronouns
	)!;

	return newUnicorn;
});

function getRawCollections(): Array<RawCollectionInfo & { slug: string }> {
	const slugs = fs.readdirSync(collectionsDirectory);
	const collections = slugs.map((slug) => {
		const fileContents = fs.readFileSync(
			join(collectionsDirectory, slug, "index.md"),
			"utf8"
		);
		const { data: frontmatter } = matter(fileContents);
		return {
			...(frontmatter as RawCollectionInfo),
			slug,
		};
	});
	return collections;
}

const collectionsRaw = getRawCollections();

export {
	fullUnicorns as unicorns,
	rolesRaw as roles,
	pronounsRaw as pronouns,
	licensesRaw as licenses,
	collectionsRaw as collections,
};
