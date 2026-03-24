import type {
	TagInfo,
	PersonStub,
	CollectionStub,
	PostStub,
} from "#types/index.ts";
import * as fs from "fs/promises";
import path, { join } from "path";
import { isNotJunk as baseIsNotJunk } from "junk";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rehypePlayfulElementMap } from "./markdown/rehype-playful-element-map.ts";
import { getLanguageFromFilename } from "./translations.ts";
import aboutRaw from "../../content/data/about.json";
import rolesRaw from "../../content/data/roles.json";
import licensesRaw from "../../content/data/licenses.json";
import tagsRaw from "../../content/data/tags.json";

function isNotJunk(name: string): boolean {
	// Ignore VSCode and JetBrains project files
	return baseIsNotJunk(name) && name !== ".idea" && name !== ".vscode";
}

export const contentDirectory = join(process.cwd(), "content");

const tags = new Map<string, TagInfo>();

// This needs to use a minimal version of our unified chain,
// as we can't import `createRehypePlugins` through an Astro
// file due to the hastscript JSX
const tagExplainerParser = unified()
	.use(remarkParse, { fragment: true } as never)
	.use(remarkToRehype, { allowDangerousHtml: true })
	.use(rehypePlayfulElementMap)
	.use(rehypeStringify, { allowDangerousHtml: true, voids: [] });

for (const [key, tag] of Object.entries(tagsRaw)) {
	let explainer;
	let explainerType: TagInfo["explainerType"] | undefined;

	if ("image" in tag && tag.image.endsWith(".svg")) {
		const license = await fs
			.readFile(`public${tag.image.replace(".svg", "-LICENSE.md")}`, "utf-8")
			.catch((_) => undefined);

		const attribution = await fs
			.readFile(
				`public${tag.image.replace(".svg", "-ATTRIBUTION.md")}`,
				"utf-8",
			)
			.catch((_) => undefined);

		if (license) {
			explainer = license;
			explainerType = "license";
		} else if (attribution) {
			explainer = attribution;
			explainerType = "attribution";
		}
	}

	const explainerHtml = explainer
		? (await tagExplainerParser.process(explainer)).toString()
		: undefined;

	tags.set(key, {
		explainerHtml,
		explainerType,
		...tag,
	});
}

async function indexPerson(personPath: string): Promise<PersonStub[]> {
	const personId = path.basename(personPath);

	const files = (await fs.readdir(personPath))
		.filter(isNotJunk)
		.filter((name) => name.startsWith("index.") && name.endsWith(".md"));

	const locales = files.map(getLanguageFromFilename);

	const personObjects: PersonStub[] = [];

	for (const file of files) {
		const locale = getLanguageFromFilename(file);
		const filePath = join(personPath, file);

		personObjects.push({
			kind: "person",
			id: personId,
			slug: personId,
			file: filePath,
			locale,
			locales,
			warnings: [],
		});
	}

	return personObjects;
}

async function indexCollection(
	collectionPath: string,
	fallbackInfo: {
		authors: string[];
	},
): Promise<CollectionStub[]> {
	const slug = path.basename(collectionPath);

	const files = (await fs.readdir(collectionPath))
		.filter(isNotJunk)
		.filter((name) => name.startsWith("index.") && name.endsWith(".md"));

	const locales = files.map(getLanguageFromFilename);

	const collectionObjects: CollectionStub[] = [];
	for (const file of files) {
		const locale = getLanguageFromFilename(file);
		const filePath = join(collectionPath, file);

		collectionObjects.push({
			kind: "collection",
			slug,
			file: filePath,
			locale,
			locales,
			authors: fallbackInfo.authors,
			warnings: [],
		});
	}

	return collectionObjects;
}

async function indexPost(
	postPath: string,
	fallbackInfo: {
		authors: string[];
		collection?: string;
	},
): Promise<PostStub[]> {
	const slug = path.basename(postPath);
	const files = (await fs.readdir(postPath))
		.filter(isNotJunk)
		.filter((name) => name.startsWith("index.") && name.endsWith(".md"));

	const locales = files.map(getLanguageFromFilename);

	const postObjects: PostStub[] = [];
	for (const file of files) {
		const locale = getLanguageFromFilename(file);
		const filePath = join(postPath, file);

		postObjects.push({
			kind: "post",
			slug,
			file: filePath,
			locale,
			locales,
			authors: fallbackInfo.authors,
			collection: fallbackInfo.collection,
			warnings: [],
		});
	}

	return postObjects;
}

const people = new Map<string, PersonStub[]>();
for (const personId of await fs.readdir(contentDirectory)) {
	if (!isNotJunk(personId)) continue;
	const personPath = join(contentDirectory, personId);
	const personEntries = await indexPerson(personPath);
	if (personEntries.length) {
		people.set(personId, personEntries);
	}
}

const collections = new Map<string, CollectionStub[]>();
for (const personId of [...people.keys()]) {
	const collectionsDirectory = join(contentDirectory, personId, "collections");

	const slugs = (
		await fs.readdir(collectionsDirectory).catch((_) => [])
	).filter(isNotJunk);

	for (const slug of slugs) {
		const collectionPath = join(collectionsDirectory, slug);

		if (collections.has(slug)) {
			throw new Error(
				`Post slug collision on ${collectionPath} - already exists: ${collections.get(slug)?.at(0)?.file}`,
			);
		}

		const collectionEntries = await indexCollection(collectionPath, {
			authors: [personId],
		});
		if (collectionEntries.length) {
			collections.set(slug, collectionEntries);
		}
	}
}

const posts = new Map<string, PostStub[]>();
await Promise.all(
	[...collections.values()].map(async (collection) => {
		const postsDirectory = join(
			contentDirectory,
			collection[0].authors[0],
			"collections",
			collection[0].slug,
			"posts",
		);

		const slugs = (await fs.readdir(postsDirectory).catch((_) => [])).filter(
			isNotJunk,
		);

		await Promise.all(
			slugs.map(async (slug) => {
				const postPath = join(postsDirectory, slug);

				if (posts.has(slug)) {
					throw new Error(
						`Post slug collision on ${postPath} - already exists: ${posts.get(slug)?.at(0)?.file}`,
					);
				}

				const postEntries = await indexPost(postPath, {
					authors: collection[0].authors,
					collection: collection[0].slug,
				});
				if (postEntries.length) {
					posts.set(slug, postEntries);
				}
			}),
		);
	}),
);
await Promise.all(
	[...people.keys()].map(async (personId) => {
		const postsDirectory = join(contentDirectory, personId, "posts");

		const slugs = (await fs.readdir(postsDirectory).catch((_) => [])).filter(
			isNotJunk,
		);

		await Promise.all(
			slugs.map(async (slug) => {
				const postPath = join(postsDirectory, slug);

				if (posts.has(slug)) {
					throw new Error(
						`Post slug collision on ${postPath} - already exists: ${posts.get(slug)?.at(0)?.file}`,
					);
				}

				const postEntries = await indexPost(postPath, {
					authors: [personId],
				});
				if (postEntries.length) {
					posts.set(slug, postEntries);
				}
			}),
		);
	}),
);

// TODO: remove and migrate totalPostCount/totalWordCount to api
/*{
	// sum the totalWordCount and totalPostCount for each person object
	for (const postLocales of [...posts.values()]) {
		const [post] = postLocales;
		if (!post) continue;
		if (post.noindex) continue;

		for (const authorId of post.authors) {
			const personLocales = people.get(authorId) || [];
			for (const person of personLocales) {
				person.totalPostCount += 1;
				person.totalWordCount += post.wordCount;
			}
		}
	}
}*/

export {
	aboutRaw as about,
	rolesRaw as roles,
	licensesRaw as licenses,
	people,
	collections,
	posts,
	tags,
};
