import * as api from "utils/api";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";
import { getMarkdownVFile } from "utils/markdown/getMarkdownVFile";
import { getExcerpt } from "utils/markdown/get-excerpt";
import matter from "gray-matter";

interface ExtendedPostInfo extends PostInfo {
	searchMeta: string;
	publishedTimestamp: number;
}

interface ExtendedCollectionInfo extends CollectionInfo {
	excerpt: string;
	searchMeta: string;
	publishedTimestamp: number;
}

export const GET = async () => {
	const posts = await Promise.all(
		api.getPostsByLang("en").map(async (post) => {
			// Include complete post content as the excerpt
			const vfile = await getMarkdownVFile(post);
			const vfileContent = matter(vfile.value.toString()).content;
			const excerpt = getExcerpt(vfileContent, undefined);
			// Collect searchable author info (name, social media handles, etc)
			const searchMeta = post.authors
				.map((id) => api.getPersonById(id, "en"))
				.filter((a) => !!a)
				.map((a) => new Set([a.id, a.name, ...Object.values(a.socials)]))
				.flatMap((set) => Array.from(set))
				.join(" ");

			return {
				...post,
				excerpt,
				searchMeta,
				publishedTimestamp: new Date(post.published).getTime(),
			} satisfies ExtendedPostInfo;
		}),
	);

	const collections = api.getCollectionsByLang("en").map((collection) => {
		const chapters = api.getPostsByCollection(collection.slug, "en");
		const excerpt = chapters
			.map((chapter) => `${chapter.title} ${chapter.description}`)
			.join(" ");
		// Collect searchable author info (name, social media handles, etc)
		const searchMeta = collection.authors
			.map((id) => api.getPersonById(id, "en"))
			.filter((a) => !!a)
			.map((a) => new Set([a.id, a.name, ...Object.values(a.socials)]))
			.flatMap((set) => Array.from(set))
			.join(" ");

		return {
			...collection,
			excerpt,
			searchMeta,
			publishedTimestamp: new Date(collection.published).getTime(),
		} satisfies ExtendedCollectionInfo;
	});

	const json = JSON.stringify({
		posts,
		collections,
	});

	return new Response(json);
};
