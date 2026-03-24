import type {
	CollectionInfo,
	CollectionStub,
	RawCollectionInfo,
} from "#types/CollectionInfo.ts";
import * as path from "path";
import * as fs from "fs/promises";
import { resolveImageFile } from "./resolveImageFile.ts";
import { isNotJunk } from "./isNotJunk.ts";
import { MarkdownVFile } from "../markdown/types.ts";
import { getMarkdownVFile } from "../markdown/getMarkdownVFile.ts";
import { Value } from "typebox/value";
import { parseFrontmatter } from "./parseFrontmatter.ts";
import { CollectionInfoSchema } from "./schema/CollectionInfoSchema.ts";
import { logError } from "../markdown/logger.ts";

export async function readCollection(
	stub: CollectionStub,
	vfilePromise: Promise<MarkdownVFile> = getMarkdownVFile(stub),
): Promise<CollectionInfo> {
	const vfile = await vfilePromise;
	const collectionPath = stub.file.split("/").slice(0, -1).join("/");
	const { frontmatter, frontmatterNode } =
		await parseFrontmatter<RawCollectionInfo>(vfile);

	try {
		Value.Parse(CollectionInfoSchema, frontmatter);
	} catch (e) {
		logError(
			vfile,
			frontmatterNode,
			e instanceof Error ? e.message : String(e),
		);
	}

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
