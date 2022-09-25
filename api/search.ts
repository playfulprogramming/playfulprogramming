import type { VercelRequest, VercelResponse } from "@vercel/node";

// import {getAllPosts} from '../src/utils/get-all-posts';

import exportedIndex from "../searchIndex";
import flex from "flexsearch";

const { Document } = flex;

const document = new Document({
	context: true,
	document: {
		id: "slug",
		index: [
			"slug",
			"title",
			"excerpt",
			"description",
			"contentMeta",
			"tags",
			"authorsMeta",
		],
		store: ["slug", "title", "excerpt", "description", "tags", "authorsMeta"],
	},
});

const keys = Object.keys(exportedIndex);

let cache = null;

// const posts = getAllPosts('en');

export default async (_req: VercelRequest, res: VercelResponse) => {
	if (!cache) {
		cache = await Promise.all(
			keys.map((key) => {
				return document.import(key, exportedIndex[key]);
			})
		);
	}
	res.send(document.search("Angular", { enrich: true }));
};
