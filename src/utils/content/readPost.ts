import type { PostInfo, PostStub, RawPostInfo } from "#types/PostInfo.ts";
import { getExcerpt } from "#utils/markdown/get-excerpt.ts";
import { resolveImageFile } from "./resolveImageFile.ts";
import { contentDirectory } from "./common.ts";
import * as path from "path";
import dayjs from "dayjs";
import { MarkdownVFile } from "../markdown/types.ts";
import { getMarkdownVFile } from "../markdown/getMarkdownVFile.ts";
import { parseFrontmatter } from "./parseFrontmatter.ts";
import { ParseError, Value } from "typebox/value";
import { PostInfoSchema } from "./schema/PostInfoSchema.ts";
import { logError } from "../markdown/logger.ts";

export async function readPost(
	stub: PostStub,
	vfilePromise: Promise<MarkdownVFile> = getMarkdownVFile(stub),
): Promise<PostInfo> {
	const vfile = await vfilePromise;
	const vfileContent = vfile.value as string;
	const postPath = stub.file.split("/").slice(0, -1).join("/");
	const { frontmatter, frontmatterNode } =
		await parseFrontmatter<RawPostInfo>(vfile);

	try {
		Value.Parse(PostInfoSchema, frontmatter);
	} catch (e) {
		if (e instanceof ParseError) {
			for (const error of e.cause.errors) {
				logError(
					vfile,
					frontmatterNode,
					`${error.schemaPath}: ${error.message}`,
				);
			}
		} else {
			logError(vfile, frontmatterNode, String(e));
		}
	}

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
	const wordCount = vfileContent.split(/\s+/).length;

	// get an excerpt of the post markdown no longer than 150 chars
	const excerpt = getExcerpt(vfileContent, 150);

	const coverImgMeta = frontmatter.coverImg
		? await resolveImageFile(frontmatter.coverImg, postPath)
		: undefined;
	const socialImgMeta = frontmatter.socialImg
		? await resolveImageFile(frontmatter.socialImg, postPath)
		: undefined;

	return {
		...frontmatter,
		...stub,
		authors: frontmatter.authors ?? stub.authors,
		path: path.relative(contentDirectory, postPath),
		tags: frontmatter.tags || [],
		wordCount,
		description: frontmatter.description || excerpt,
		excerpt,
		publishedMeta:
			frontmatter.published &&
			dayjs(frontmatter.published).format("MMMM D, YYYY"),
		editedMeta:
			frontmatter.edited && dayjs(frontmatter.edited).format("MMMM D, YYYY"),
		coverImgMeta,
		socialImgMeta,
	};
}
