import { CloudManager } from "@oramacloud/client";
import * as api from "utils/api";
import type { SearchPostInfo } from "types/PostInfo";
import type { SearchCollectionInfo } from "types/CollectionInfo";
import { getMarkdownVFile } from "utils/markdown/getMarkdownVFile";
import { getExcerpt } from "utils/markdown/get-excerpt";
import matter from "gray-matter";
import {
	ORAMA_COLLECTIONS_INDEX_ID,
	ORAMA_POSTS_INDEX_ID,
} from "src/views/search/constants";
import { getPostImages } from "utils/hoof";
import { relative } from "path";

if (!process.env.ORAMA_PRIVATE_API_KEY) {
	console.error("ORAMA_PRIVATE_API_KEY is not defined in the environment!");
	process.exit(1);
}

const oramaCloudManager = new CloudManager({
	api_key: process.env.ORAMA_PRIVATE_API_KEY,
});

async function deployPosts(posts: SearchPostInfo[]) {
	const index = oramaCloudManager.index(ORAMA_POSTS_INDEX_ID);
	console.log(`Uploading ${posts.length} posts to ${ORAMA_POSTS_INDEX_ID}...`);
	const isSnapshot = await index.snapshot(posts);
	if (!isSnapshot) {
		throw new Error("Unable to upload posts.");
	}

	console.log(`Deploying ${ORAMA_POSTS_INDEX_ID}...`);
	const isDeployed = await index.deploy();
	if (!isDeployed) {
		throw new Error("Unable to deploy posts.");
	}

	console.log(`Index ${ORAMA_POSTS_INDEX_ID} is deployed!`);
}

async function deployCollections(collections: SearchCollectionInfo[]) {
	const index = oramaCloudManager.index(ORAMA_COLLECTIONS_INDEX_ID);

	console.log(
		`Uploading ${collections.length} collections to ${ORAMA_COLLECTIONS_INDEX_ID}...`,
	);
	const isSnapshot = await index.snapshot(collections);
	if (!isSnapshot) {
		throw new Error("Unable to upload collections.");
	}

	console.log(`Deploying ${ORAMA_COLLECTIONS_INDEX_ID}...`);
	const isDeployed = await index.deploy();
	if (!isDeployed) {
		throw new Error("Unable to deploy collections.");
	}

	console.log(`Index ${ORAMA_COLLECTIONS_INDEX_ID} is deployed!`);
}

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

		const postImages = await getPostImages({
			slug: post.slug,
			author: post.authors[0],
			path: relative(process.cwd(), post.file),
		}).catch((e) => {
			console.error(e);
			return undefined;
		});

		return {
			...post,
			banner: postImages?.banner,
			excerpt,
			searchMeta,
			publishedTimestamp: new Date(post.published).getTime(),
		} satisfies SearchPostInfo;
	}),
);

await deployPosts(posts);

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
	} satisfies SearchCollectionInfo;
});

await deployCollections(collections);
