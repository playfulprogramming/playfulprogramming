import type {
	CollectionInfo,
	CollectionStub,
	RawCollectionInfo,
} from "#types/CollectionInfo.ts";
import * as path from "path";
import * as fs from "fs/promises";
import matter from "gray-matter";
import { resolveImageFile } from "./resolveImageFile.ts";
import { isNotJunk } from "./isNotJunk.ts";

export async function readCollection(
	stub: CollectionStub,
): Promise<CollectionInfo> {
	const collectionPath = stub.file.split("/").slice(0, -1).join("/");
	const filePath = stub.file;
	const fileContents = await fs.readFile(filePath, "utf-8");
	const frontmatter = matter(fileContents).data as RawCollectionInfo;

	const coverImgMeta = await resolveImageFile(
		frontmatter.coverImg,
		collectionPath,
	);
	const socialImgMeta = frontmatter.socialImg
		? await resolveImageFile(frontmatter.socialImg, collectionPath)
		: undefined;

	const frontmatterTags = frontmatter.tags || [];

	// count the number of posts in the collection
	const postCount = (
		await fs.readdir(path.join(collectionPath, "posts")).catch((_) => [])
	).filter(isNotJunk).length;

	const fallbackAuthor = String(collectionPath.split("/").at(1));

	return {
		...frontmatter,
		...stub,
		authors: frontmatter.authors ?? stub.authors,
		postCount,
		tags: frontmatterTags,
		coverImgMeta,
		socialImgMeta,
	};
}
