import * as fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import type { PostInfo } from "#types/PostInfo.ts";
import { contentDirectory } from "./data.ts";

/**
 * Returns the file content (excluding frontmatter) of the given post.
 */
export async function getPostContentMarkdown(post: PostInfo): Promise<string> {
	const indexName =
		post.locale === "en" ? "index.md" : `index.${post.locale}.md`;
	const fileContents = await fs.readFile(
		path.join(contentDirectory, post.path, indexName),
		"utf-8",
	);
	const { content } = matter(fileContents);
	return content;
}
