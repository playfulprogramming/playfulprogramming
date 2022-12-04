import { Root } from "hast";
import { Plugin } from "unified";
import matter from "gray-matter";
import { readFileSync, existsSync } from "fs";
import * as path from "path";
import { collections, licenses, unicorns } from "../data";
import dayjs from "dayjs";
import { Languages } from "../../types/index";
import { languages } from "../../constants/index";
import { dirname, resolve } from "path";

const getIndexPath = (lang: Languages) => {
	const indexPath = lang !== "en" ? `index.${lang}.md` : `index.md`;
	return indexPath;
};

interface RehypeUnicornPopulatePostProps {}

export const rehypeUnicornPopulatePost: Plugin<
	[RehypeUnicornPopulatePostProps | never],
	Root
> = () => {
	return (_, file) => {
		function setData(key: string, val: any) {
			(file.data.astro as any).frontmatter[key] = val;
		}

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

		const langsToQuery: Languages[] = Object.keys(languages).filter(
			(l) => l !== locale
		) as never;
		const translations = langsToQuery
			.filter((lang) =>
				existsSync(resolve(dirname(file.path), getIndexPath(lang)))
			)
			.reduce((prev, lang) => {
				prev[lang] = languages[lang];
				return prev;
			}, {} as Record<Languages, string>);

		let collectionSlug;
		if (frontmatter.series) {
			collectionSlug = collections.find(
				(collection) => collection.associatedSeries === frontmatter.series
			)?.slug;
		}
		if (!collectionSlug) collectionSlug = null;
		const authorsMeta = frontmatter.authors
			? (frontmatter.authors as string[]).map(
					(author) => unicorns.find((unicorn) => unicorn.id === author)!
			  )
			: undefined;

		let license;
		if (frontmatter.license) {
			license = licenses.find((l) => l.id === frontmatter.license);
		}
		if (!license) license = null;

		const publishedMeta = frontmatter.published
			? dayjs(frontmatter.published).format("MMMM D, YYYY")
			: undefined;
		const editedMeta = frontmatter.edited
			? dayjs(frontmatter.edited).format("MMMM D, YYYY")
			: undefined;

		setData("slug", slug);
		setData("locale", locale);
		setData("translations", translations);
		setData("authorsMeta", authorsMeta);
		setData("licenseMeta", license);
		setData("frontmatterBackup", frontmatter);
		setData("contentMeta", content);
		setData("publishedMeta", publishedMeta);
		setData("editedMeta", editedMeta);
		setData("collectionSlug", collectionSlug);
	};
};
