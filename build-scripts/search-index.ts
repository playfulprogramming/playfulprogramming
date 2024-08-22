import * as fs from "fs";
import * as path from "path";
import * as api from "utils/api";
import { PostInfo } from "types/PostInfo";
import { PersonInfo } from "types/PersonInfo";
import { CollectionInfo } from "types/CollectionInfo";

interface ExtendedPostInfo extends PostInfo {
	authorsMeta: PersonInfo[];
}

interface ExtendedCollectionInfo extends CollectionInfo {
	authorsMeta: PersonInfo[];
}

const posts = api.getPostsByLang("en").map((post) => {
	return {
		...post,
		authorsMeta: post.authors
			.map((author) => {
				return api.getPersonById(author, "en")!;
			})
			.filter(Boolean),
	} as ExtendedPostInfo;
});

const collections = api.getCollectionsByLang("en").map((collection) => {
	return {
		...collection,
		authorsMeta: collection.authors
			.map((author) => {
				return api.getPersonById(author, "en")!;
			})
			.filter(Boolean),
	} as ExtendedCollectionInfo;
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
