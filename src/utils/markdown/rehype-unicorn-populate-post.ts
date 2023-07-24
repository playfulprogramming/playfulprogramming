import { Root } from "hast";
import { Plugin } from "unified";
import matter from "gray-matter";
import { readFileSync } from "fs";
import * as path from "path";
import { collections, posts } from "../data";
import { getLanguageFromFilename } from "..";
import { AstroVFile } from "utils/markdown/types";

interface RehypeUnicornPopulatePostProps {}

export const rehypeUnicornPopulatePost = (() => {
	return (_, file: AstroVFile) => {
		const fileContents = readFileSync(file.path, "utf8");
		const { data: frontmatter, content } = matter(fileContents);

		const directorySplit = file.path.split(path.sep);

		// This is the folder name, AKA how we generate the slug ID
		const slug = directorySplit.at(-2);
		// This is the containing folder, two levels above the post
		const folder = directorySplit.at(-3) as "blog" | "collections" | "content";

		// Calculate post locale
		// index.md or index.es.md
		const indexName = directorySplit.at(-1);
		const locale = getLanguageFromFilename(indexName);

		// Find any additional metadata from 'src/utils/data' for the parsed post
		// - this step needs to support collections / all other markdown pages, not just posts
		let data = null;
		if (folder === "blog") {
			// Find the post metadata from its slug+locale
			data = posts.find((p) => p.slug === slug && p.locale === locale);
		} else if (folder === "collections") {
			// Find the collection metadata from its slug+locale
			data = collections.find((c) => c.slug === slug && c.locale === locale);
		}

		// Write the data to Astro's frontmatter
		Object.assign(file.data.astro.frontmatter, {
			slug,
			locale,
			...data,
			frontmatterBackup: { ...frontmatter },
			contentMeta: content,
		});
	};
}) satisfies Plugin<[RehypeUnicornPopulatePostProps | never], Root>;
