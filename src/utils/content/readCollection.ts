import {
	CollectionInfoSchema,
	type CollectionInfo,
	type CollectionStub,
} from "#types/CollectionInfo.ts";
import * as path from "path";
import * as fs from "fs/promises";
import { resolveImageFile } from "./resolveImageFile.ts";
import { isNotJunk } from "./isNotJunk.ts";
import type { MarkdownVFile } from "../markdown/types.ts";
import { parseFrontmatter } from "./parseFrontmatter.ts";
import { cache } from "./common.ts";

export const readCollection = cache(
	async (
		stub: CollectionStub,
		vfile: MarkdownVFile,
	): Promise<CollectionInfo> => {
		const collectionPath = stub.file.split("/").slice(0, -1).join("/");
		const { frontmatter } = await parseFrontmatter(vfile, CollectionInfoSchema);

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
	},
);
