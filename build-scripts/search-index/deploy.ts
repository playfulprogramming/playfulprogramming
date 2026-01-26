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

function shallowCompare<T extends object>(a: T, b: T) {
	return Object.entries(a).every(([key, value]) => value === b[key as never]);
}

async function upsertCollection(
	schema: typeof collectionSchema | typeof postSchema,
) {
	const collection = findCollection(schema.name);

	if (!collection) {
		console.log(`Creating ${name} collection...`);
		await client.collections().create(schema);
		return;
	}

	const updateSchema: Partial<typeof schema> = {
		fields: [],
	};

	for (const field of schema.fields) {
		const matchingField = collection.fields.find((f) => f.name === field.name);
		if (!matchingField) {
			updateSchema.fields!.push(field);
			continue;
		}
		if (!shallowCompare(matchingField, field)) {
			// https://typesense.org/docs/29.0/api/collections.html#modifying-an-existing-field
			updateSchema.fields!.push({ name: field.name, drop: true } as never);
			updateSchema.fields!.push(field);
		}
	}

	if (!updateSchema.fields?.length) return;

	await client.collections(collection.name).update(updateSchema);
}

async function deployPosts(posts: SearchPostInfo[]) {
	await upsertCollection(postSchema);

	console.log(`Importing posts...`);
	await client
		.collections<PostDocument>(postSchema.name)
		.documents()
		.import(posts);

	console.log(`Index posts is deployed!`);
}

async function deployCollections(collections: SearchCollectionInfo[]) {
	await upsertCollection(collectionSchema);

	console.log(`Importing collections...`);
	await client
		.collections<PostDocument>(collectionSchema.name)
		.documents()
		.import(collections);

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
