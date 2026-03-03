import { Client } from "typesense";
import { OverloadReturnType } from "./types";

type CollectionsOverload = Client["collections"];
type Collections = OverloadReturnType<CollectionsOverload, []>;
type CreateSchema = Parameters<Collections["create"]>[0];

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
