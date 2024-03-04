import { Root } from "hast";
import { Plugin } from "unified";
import { getSuggestedArticles } from "../get-suggested-articles";
import path from "path";
import { AstroVFile } from "utils/markdown/types";

interface RehypeUnicornGetSuggestedPostsProps {}

export const rehypeUnicornGetSuggestedPosts: Plugin<
	[RehypeUnicornGetSuggestedPostsProps | never],
	Root
> = () => {
	return (_, file: AstroVFile) => {
		const splitFilePath = path.dirname(file.path).split(path.sep);
		// "collections" | "blog"
		const parentFolder = splitFilePath.at(-2);

		if (parentFolder === "collections") return;

		function setData(key: string, val: unknown) {
			file.data.astro.frontmatter[key] = val;
		}

		const post = {
			...file.data.astro.frontmatter.frontmatterBackup,
			...file.data.astro.frontmatter,
		};

		const suggestedArticles = getSuggestedArticles(post, post.locale);
		setData("suggestedArticles", suggestedArticles);
	};
};
