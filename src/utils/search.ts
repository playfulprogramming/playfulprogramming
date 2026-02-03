import Typesense from "typesense";
import {
	PUBLIC_SEARCH_ENDPOINT_HOST,
	PUBLIC_SEARCH_ENDPOINT_PORT,
	PUBLIC_SEARCH_ENDPOINT_PROTOCOL,
	PUBLIC_SEARCH_KEY,
} from "../views/search/constants";

// Don't need this value at runtime, only there to get type information
const client = new Typesense.Client({
	nodes: [
		{
			host: PUBLIC_SEARCH_ENDPOINT_HOST,
			port: PUBLIC_SEARCH_ENDPOINT_PORT,
			protocol: PUBLIC_SEARCH_ENDPOINT_PROTOCOL,
		},
	],
	apiKey: PUBLIC_SEARCH_KEY,
});
const collection = client.collections();
type CreateSchema = Parameters<(typeof collection)["create"]>[0];

export const postSchema = {
	name: "posts",
	fields: [
		{ name: "slug", type: "string" },
		{ name: "title", type: "string" },
		{ name: "excerpt", type: "string" },
		{ name: "description", type: "string" },
		{ name: "searchMeta", type: "string" },
		{ name: "tags", type: "string[]", facet: true },
		{ name: "authors", type: "string[]", facet: true },
		{ name: "publishedTimestamp", type: "int64" },
	],
} satisfies CreateSchema;

export interface PostDocument {
	slug: string;
	title: string;
	excerpt: string;
	description: string;
	searchMeta: string;
	tags: string[];
	authors: string[];
	publishedTimestamp: number;
}

export const collectionSchema = {
	name: "collections",
	fields: [
		{ name: "slug", type: "string" },
		{ name: "title", type: "string" },
		{ name: "excerpt", type: "string" },
		{ name: "description", type: "string" },
		{ name: "searchMeta", type: "string" },
		{ name: "tags", type: "string[]", facet: true },
		{ name: "authors", type: "string[]", facet: true },
		{ name: "publishedTimestamp", type: "int64" },
	],
} satisfies CreateSchema;

export interface CollectionDocument {
	slug: string;
	title: string;
	excerpt: string;
	description: string;
	searchMeta: string;
	tags: string[];
	authors: string[];
	publishedTimestamp: number;
}
