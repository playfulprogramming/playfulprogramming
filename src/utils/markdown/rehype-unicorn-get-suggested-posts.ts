import { Root } from "hast";
import { Plugin } from "unified";
import { getSuggestedArticles } from "../get-suggested-articles";
import path from "path";

interface RehypeUnicornGetSuggestedPostsProps {}

export const rehypeUnicornGetSuggestedPosts: Plugin<
	[RehypeUnicornGetSuggestedPostsProps | never],
	Root
> = () => {
	return (_, file) => {
		const splitFilePath = path.dirname(file.path).split(path.sep);
		// "collections" | "blog"
		const parentFolder = splitFilePath.at(-2);

		if (parentFolder === "collections") return;

		function setData(key: string, val: any) {
			(file.data.astro as any).frontmatter[key] = val;
		}

		const post = {
			...(file.data.astro as any).frontmatter.frontmatterBackup,
			...(file.data.astro as any).frontmatter,
		};

		const suggestedArticles = getSuggestedArticles(post, post.locale);
		setData("suggestedArticles", suggestedArticles);
	};
};
