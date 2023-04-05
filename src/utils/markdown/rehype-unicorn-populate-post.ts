import { Root } from "hast";
import { Plugin } from "unified";
import matter from "gray-matter";
import { readFileSync } from "fs";
import * as path from "path";
import { posts } from "../data";

interface RehypeUnicornPopulatePostProps {}

export const rehypeUnicornPopulatePost: Plugin<
	[RehypeUnicornPopulatePostProps | never],
	Root
> = () => {
	return (_, file) => {
		const fileContents = readFileSync(file.path, "utf8");
		const { data: frontmatter, content } = matter(fileContents);

		const directorySplit = file.path.split(path.sep);

		// This is the folder name, AKA how we generate the slug ID
		const slug = directorySplit.at(-2);

		// Calculate post locale
		// index.md or index.es.md
		const indexName = directorySplit.at(-1);
		const indexSplit = indexName.split(".");
		let locale = indexSplit.at(-2);
		if (locale === "index") {
			locale = "en";
		}

		// Find the post metadata from its slug+locale
		// - worth noting, this step also needs to support collections / all other markdown pages, not just posts
		const post = posts.find((p) => p.slug === slug && p.locale === locale);

		// Write the data to Astro's frontmatter
		Object.assign((file.data.astro as any).frontmatter, {
			slug,
			locale,
			...post,
			frontmatterBackup: { ...frontmatter },
			contentMeta: content,
		});
	};
};
