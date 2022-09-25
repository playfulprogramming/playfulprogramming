import type { VercelRequest, VercelResponse } from "@vercel/node";

import exportedIndex from "../searchIndex";
import Fuse from "fuse.js";

const myIndex = Fuse.parseIndex(exportedIndex.index);

const posts = exportedIndex.posts;

const fuse = new Fuse(
	posts,
	{
		threshold: 0.3,
		ignoreLocation: true,
		includeScore: true,
		ignoreFieldNorm: true,
	},
	myIndex
);

export default async (req: VercelRequest, res: VercelResponse) => {
	// TODO: `pickdeep` only required fields
	const searchStr = req?.query?.query as string;
	if (!searchStr) return [];
	if (Array.isArray(searchStr)) return [];
	const items = fuse.search(searchStr).map((item) => item.item);
	res.send(items);
};
