import * as api from "utils/api";
import type { PostInfo, SearchPostInfo } from "types/PostInfo";
import type { SearchCollectionInfo } from "types/CollectionInfo";
import { getMarkdownVFile } from "utils/markdown/getMarkdownVFile";
import { getExcerpt } from "utils/markdown/get-excerpt";
import matter from "gray-matter";
import { getPostImages } from "utils/hoof";
import asyncPool from "tiny-async-pool";
import env from "constants/env";
import Typesense from "typesense";
import {
	PUBLIC_SEARCH_ENDPOINT_HOST,
	PUBLIC_SEARCH_ENDPOINT_PORT,
	PUBLIC_SEARCH_ENDPOINT_PROTOCOL,
} from "../../src/views/search/constants";
import { collectionSchema, PostDocument, postSchema } from "utils/search";

// The deploy script cannot use import.meta.env, as it runs through tsx
if (!env.TYPESENSE_PRIVATE_API_KEY) {
	console.error("TYPESENSE_PRIVATE_API_KEY is not defined in the environment!");
	process.exit(1);
}

const client = new Typesense.Client({
	nodes: [
		{
			host: PUBLIC_SEARCH_ENDPOINT_HOST,
			port: PUBLIC_SEARCH_ENDPOINT_PORT,
			protocol: PUBLIC_SEARCH_ENDPOINT_PROTOCOL,
		},
	],
	apiKey: env.TYPESENSE_PRIVATE_API_KEY,
	connectionTimeoutSeconds: 10,
});

const existingCollections = await client.collections().retrieve();

function findCollection(name: string) {
	return existingCollections.find((c) => c.name === name);
}

async function deployPosts(posts: SearchPostInfo[]) {
	if (!findCollection(postSchema.name)) {
		console.log(`Creating posts collection...`);
		await client.collections().create(postSchema);
	} else {
		console.log(`Updating posts collection...`);
		const { fields } = postSchema;
		await client.collections(postSchema.name).update({ fields });
	}

	console.log(`Importing posts...`);
	for (const post of posts) {
		await client
			.collections<PostDocument>(postSchema.name)
			.documents()
			.upsert(post);
	}

	console.log(`Index posts is deployed!`);
}

async function deployCollections(collections: SearchCollectionInfo[]) {
	if (!findCollection(collectionSchema.name)) {
		console.log(`Creating collections collection...`);
		await client.collections().create(collectionSchema);
	} else {
		console.log(`Updating collections collection...`);
		const { fields } = collectionSchema;
		await client.collections(collectionSchema.name).update({ fields });
	}

	console.log(`Importing collections...`);
	for (const collection of collections) {
		await client
			.collections<CollectionDocument>(collectionSchema.name)
			.documents()
			.upsert(collection);
	}

	console.log(`Index collections is deployed!`);
}

async function processPost(post: PostInfo): Promise<SearchPostInfo> {
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

	const postImages = await getPostImages(post).catch((e) => {
		console.error(e);
		return undefined;
	});

	console.debug("Indexed post", post.slug);

	return {
		...post,
		banner: postImages?.banner || undefined,
		excerpt,
		searchMeta,
		publishedTimestamp: new Date(post.published).getTime(),
	};
}

const posts: SearchPostInfo[] = [];
for await (const post of asyncPool(8, api.getPostsByLang("en"), processPost)) {
	posts.push(post);
}

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

	console.debug("Indexed collection", collection.slug);

	return {
		...collection,
		excerpt,
		searchMeta,
		publishedTimestamp: new Date(collection.published).getTime(),
	} satisfies SearchCollectionInfo;
});

await deployCollections(collections);
