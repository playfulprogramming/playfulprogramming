import * as fs from "fs";
import * as path from "path";
import * as api from "utils/api";
import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";

interface ExtendedPostInfo extends PostInfo {
	publishedTimestamp: number;
}

interface ExtendedCollectionInfo extends CollectionInfo {
	publishedTimestamp: number;
}

const posts = api.getPostsByLang("en").map((post) => {
	return {
		...post,
		publishedTimestamp: new Date(post.published).getTime(),
	} satisfies ExtendedPostInfo;
});

const collections = api.getCollectionsByLang("en").map((collection) => {
	return {
		...collection,
		publishedTimestamp: new Date(collection.published).getTime(),
	} satisfies ExtendedCollectionInfo;
});

const json = JSON.stringify({
	posts,
	collections,
});

fs.writeFileSync(
	path.resolve(process.cwd(), "./public/searchIndex.json"),
	json,
);

const people = api.getPeopleByLang("en");

fs.writeFileSync(
	path.resolve(process.cwd(), "./public/peopleIndex.json"),
	JSON.stringify({
		people,
	}),
);
