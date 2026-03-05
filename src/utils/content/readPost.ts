import type { PostInfo, PostStub, RawPostInfo } from "#types/PostInfo.ts";
import * as fs from "fs/promises";
import matter from "gray-matter";
import { getExcerpt } from "#utils/markdown/get-excerpt.ts";
import { resolveImageFile } from "./resolveImageFile.ts";
import { contentDirectory } from "./common.ts";
import * as path from "path";
import dayjs from "dayjs";

export async function readPost(stub: PostStub): Promise<PostInfo> {
	const filePath = stub.file;
	const postPath = stub.file.split("/").slice(0, -1).join("/");
	const fileContents = await fs.readFile(filePath, "utf-8");
	const fileMatter = matter(fileContents);
	const frontmatter = fileMatter.data as RawPostInfo;

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
	const wordCount = fileMatter.content.split(/\s+/).length;

	// get an excerpt of the post markdown no longer than 150 chars
	const excerpt = getExcerpt(fileMatter.content, 150);

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
