import * as api from "utils/api";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";
import { getMarkdownVFile } from "utils/markdown/getMarkdownVFile";
import { getExcerpt } from "utils/markdown/get-excerpt";
import matter from "gray-matter";

interface ExtendedPostInfo extends PostInfo {
	publishedTimestamp: number;
}

interface ExtendedCollectionInfo extends CollectionInfo {
	publishedTimestamp: number;
}

export const GET = async () => {
	const posts = await Promise.all(
		api.getPostsByLang("en").map(async (post) => {
			// Include complete post content as the excerpt
			const vfile = await getMarkdownVFile(post);
			const vfileContent = matter(vfile.value.toString()).content;
			const excerpt = getExcerpt(vfileContent, undefined);

			return {
				...post,
				excerpt,
				publishedTimestamp: new Date(post.published).getTime(),
			} satisfies ExtendedPostInfo;
		}),
	);

	const collections = api.getCollectionsByLang("en").map((collection) => {
		return {
			...collection,
			publishedTimestamp: new Date(collection.published).getTime(),
		} satisfies ExtendedCollectionInfo;
	});

	const json = JSON.stringify({
		posts,
		collections,
	});

	return new Response(json);
};
