import type { VercelRequest, VercelResponse } from "@vercel/node";

import exportedIndex from "../searchIndex";
// @ts-ignore
import unicornProfilePicMap from "../public/unicorn-profile-pic-map";
import Fuse from "fuse.js";
import type { PostInfo } from "../src/types/PostInfo";

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

const unicornProfilePicObj = {};
for (const picMapItem of unicornProfilePicMap) {
	unicornProfilePicObj[picMapItem.id] = picMapItem;
}

export default async (req: VercelRequest, res: VercelResponse) => {
	// TODO: `pickdeep` only required fields
	const searchStr = req?.query?.query as string;
	if (!searchStr) return [];
	if (Array.isArray(searchStr)) return [];
	const posts = fuse.search(searchStr).map((item) => item.item as PostInfo);
	const unicornProfilePicMap = posts.flatMap((post) =>
		post.authorsMeta.map((authorMeta) => unicornProfilePicObj[authorMeta.id])
	);
	res.send({ posts, totalPosts: posts.length, unicornProfilePicMap });
};
