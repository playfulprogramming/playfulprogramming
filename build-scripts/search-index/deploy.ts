import { CloudManager } from "@oramacloud/client";
import * as api from "utils/api";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";
import { getMarkdownVFile } from "utils/markdown/getMarkdownVFile";
import { getExcerpt } from "utils/markdown/get-excerpt";
import matter from "gray-matter";
import {
	ORAMA_COLLECTIONS_INDEX,
	ORAMA_COLLECTIONS_INDEX_ID,
	ORAMA_POSTS_INDEX,
	ORAMA_POSTS_INDEX_ID,
} from "src/views/search/constants";

if (!process.env.ORAMA_PRIVATE_API_KEY) {
	console.error("ORAMA_PRIVATE_API_KEY is not defined in the environment!");
	process.exit(1);
}

const oramaCloudManager = new CloudManager({
	api_key: process.env.ORAMA_PRIVATE_API_KEY,
});

interface ExtendedPostInfo extends PostInfo {
	searchMeta: string;
	publishedTimestamp: number;
}

interface ExtendedCollectionInfo extends CollectionInfo {
	excerpt: string;
	searchMeta: string;
	publishedTimestamp: number;
}

async function deployPosts(posts: ExtendedPostInfo[]) {
	const index = oramaCloudManager.index(ORAMA_POSTS_INDEX_ID);
	console.log(`Uploading ${posts.length} posts to ${ORAMA_POSTS_INDEX}...`);
	await index.snapshot(posts);
	console.log(`Deploying ${ORAMA_POSTS_INDEX}...`);
	await index.deploy();
	console.log(`Index ${ORAMA_POSTS_INDEX} is deployed!`);
}

async function deployCollections(collections: ExtendedCollectionInfo[]) {
	const index = oramaCloudManager.index(ORAMA_COLLECTIONS_INDEX_ID);
	console.log(
		`Uploading ${collections.length} collections to ${ORAMA_COLLECTIONS_INDEX}...`,
	);
	await index.snapshot(collections);
	console.log(`Deploying ${ORAMA_COLLECTIONS_INDEX}...`);
	await index.deploy();
	console.log(`Index ${ORAMA_COLLECTIONS_INDEX} is deployed!`);
}

const posts = Promise.all(
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

posts.then((posts) => deployPosts(posts));

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

deployCollections(collections);
