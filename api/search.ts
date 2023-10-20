import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fuse from "fuse.js";
import { createRequire } from "node:module";

import type { CollectionInfo, UnicornInfo, PostInfo } from "types/index";
import type { ServerReturnType } from "../src/views/search/types";

const require = createRequire(import.meta.url);
const searchIndex = require("./searchIndex.json");
const postIndex = Fuse.parseIndex(searchIndex.postIndex);
const collectionIndex = Fuse.parseIndex(searchIndex.collectionIndex);

const posts = searchIndex.posts;
const collections = searchIndex.collections;

const postFuse = new Fuse<PostInfo>(
	posts,
	{
		threshold: 0.3,
		ignoreLocation: true,
		includeScore: true,
		ignoreFieldNorm: true,
	},
	postIndex,
);

const collectionFuse = new Fuse<CollectionInfo>(
	collections,
	{
		threshold: 0.3,
		ignoreLocation: true,
		includeScore: true,
		ignoreFieldNorm: true,
	},
	collectionIndex,
);

const unicorns: Record<string, UnicornInfo> = searchIndex.unicorns;

function runQuery(req: VercelRequest): ServerReturnType {
	// TODO: `pickdeep` only required fields
	const searchStr = req?.query?.query as string;
	if (!searchStr) {
		return {
			unicorns: {},
			posts: [],
			totalPosts: 0,
			collections: [],
			totalCollections: 0,
		};
	}
	if (searchStr === "*") {
		return {
			unicorns,
			posts,
			totalPosts: posts.length,
			collections,
			totalCollections: collections.length,
		};
	}

	const searchedPosts = postFuse.search(searchStr).map((item) => item.item);
	const searchedCollections = collectionFuse
		.search(searchStr)
		.map((item) => item.item);

	const searchedUnicorns: Record<string, UnicornInfo> = {};
	for (const post of searchedPosts) {
		for (const id of post.authors) searchedUnicorns[id] = unicorns[id];
	}
	for (const collection of searchedCollections) {
		for (const id of collection.authors) searchedUnicorns[id] = unicorns[id];
	}

	return {
		unicorns: searchedUnicorns,
		posts: searchedPosts,
		totalPosts: searchedPosts.length,
		collections: searchedCollections,
		totalCollections: searchedCollections.length,
	};
}

export default async (req: VercelRequest, res: VercelResponse) => {
	const response = runQuery(req);
	res.send(response);
};
