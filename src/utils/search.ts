import { Client } from "typesense";

type CollectionsFunction = Client["collections"];
// This type is for getting the expected overload signature by argument types from collections function overload. It may break in a future update of the library if more overload signatures added for collections function because currently it assumes there are only two.
type CollectionFunctionReturnTypeWithArgs<
	T extends CollectionsFunction,
	Args,
> = Extract<
	T extends {
		(...args: infer A1): infer R1;
		(...args: infer A2): infer R2;
	}
		? [A1, R1] | [A2, R2]
		: never,
	[Args, unknown]
>[1];
type Collections = CollectionFunctionReturnTypeWithArgs<
	CollectionsFunction,
	[]
>;
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
