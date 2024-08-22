import * as fs from "fs";
import * as path from "path";
import * as api from "utils/api";

const posts = api.getPostsByLang("en");
const collections = api.getCollectionsByLang("en");
const people = api.getPeopleByLang("en");

const json = JSON.stringify({
	posts,
	collections,
	people,
});

fs.writeFileSync(
	path.resolve(process.cwd(), "./public/searchIndex.json"),
	json,
);
