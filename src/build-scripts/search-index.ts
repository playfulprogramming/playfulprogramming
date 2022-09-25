import flex from "flexsearch";

const { Document } = flex;

import { getAllPosts } from "../utils/get-all-posts";

import * as fs from "fs";
import * as path from "path";
import { PostInfo } from "types/PostInfo";

export const createIndex = async () => {
	const posts = getAllPosts("en");
	const document = new Document<PostInfo, Array<keyof PostInfo>>({
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

	posts.forEach((post) => {
		document.add(post.slug, post);
	});

	const exportedIndex: Record<string | number, PostInfo> = {};
	await document.export((key, data) => {
		exportedIndex[key] = data;
	});

	// Temporary hotpatch for issue with `export` async
	// @see https://github.com/nextapps-de/flexsearch/pull/253
	await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

	return exportedIndex;
};

const index = await createIndex();

const js = `const index = ${JSON.stringify(index)};

export default index;
`;

fs.writeFileSync(path.resolve(process.cwd(), "./searchIndex.js"), js);
