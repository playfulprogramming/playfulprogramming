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
	res.send(fuse.search(req.query.query));
};
