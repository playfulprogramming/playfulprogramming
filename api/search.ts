import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fuse from "fuse.js";
import { createRequire } from "node:module";

import type { ExtendedPostInfo } from "types/index";

const require = createRequire(import.meta.url);
const searchIndex = require("./searchIndex.json");
const index = Fuse.parseIndex(searchIndex.index);

const posts = searchIndex.posts;

const fuse = new Fuse<ExtendedPostInfo>(
	posts,
	{
		threshold: 0.3,
		ignoreLocation: true,
		includeScore: true,
		ignoreFieldNorm: true,
	},
	index
);

export default async (req: VercelRequest, res: VercelResponse) => {
	// TODO: `pickdeep` only required fields
	const searchStr = req?.query?.query as string;
	const authorStr = req?.query?.authorId as string;
	if (!searchStr) return [];
	if (Array.isArray(searchStr)) return [];
	let posts = fuse.search(searchStr).map((item) => item.item);
	if (authorStr) {
		posts = posts.filter((post) => post.authors.includes(authorStr));
	}
	res.send({ posts, totalPosts: posts.length });
};
