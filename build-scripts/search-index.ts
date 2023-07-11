import Fuse from "fuse.js";
import { getAllExtendedPosts } from "../src/utils/get-all-posts";

import * as fs from "fs";
import * as path from "path";
import { collections } from "utils/data";

const posts = [...getAllExtendedPosts("en")];

const createPostIndex = () => {
	return Fuse.createIndex(
		[
			{
				name: "title",
				weight: 2,
			},
			{
				name: "authorName",
				getFn: (post) => {
					return post.authorsMeta.map((author) => author.name).join(", ");
				},
				weight: 1.8,
			},
			{
				name: "slug",
				weight: 1.6,
			},
			{
				name: "authorHandles",
				getFn: (post) => {
					return post.authorsMeta
						.flatMap((author) => Object.values(author.socials))
						.join(", ");
				},
				weight: 1.2,
			},
			{ name: "tags", weight: 1.5, getFn: (post) => post.tags.join(", ") },
			{ name: "description", weight: 1.2 },
			{ name: "excerpt", weight: 1.2 },
		],
		posts
	).toJSON();
};

const createCollectionIndex = () => {
	return Fuse.createIndex(
		[
			{
				name: "title",
				weight: 2,
			},
			{
				name: "slug",
				weight: 1.6,
			},
			{
				name: "authorName",
				getFn: (post) => {
					return post.authorsMeta.map((author) => author.name).join(", ");
				},
				weight: 1.8,
			},
			{
				name: "authorHandles",
				getFn: (post) => {
					return post.authorsMeta
						.flatMap((author) => Object.values(author.socials))
						.join(", ");
				},
				weight: 1.2,
			},
			{
				name: "description",
				weight: 1.2,
			},
		],
		collections
	).toJSON();
};

const postIndex = createPostIndex();
const collectionIndex = createCollectionIndex();

const json = JSON.stringify({ postIndex, posts, collectionIndex, collections });
fs.writeFileSync(path.resolve(process.cwd(), "./api/searchIndex.json"), json);
