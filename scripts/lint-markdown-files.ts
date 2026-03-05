import { json } from "node:stream/consumers";
import { readPerson } from "#utils/content/readPerson.ts";
import { getLanguageFromFilename } from "#utils/translations.ts";
import * as path from "path";
import { readPost } from "#utils/content/readPost.ts";
import { readCollection } from "#utils/content/readCollection.ts";

const changedFiles = (await json(process.stdin)) as string[];

for (const file of changedFiles) {
	if (!file.startsWith("content/")) continue;
	if (!file.endsWith(".md")) continue;

	{
		const [, author] = /^content\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (author) {
			console.log(`validating author: ${author}`);
			const locale = getLanguageFromFilename(file);
			const person = await readPerson({
				kind: "person",
				id: author,
				file: path.join(process.cwd(), file),
				locale,
				locales: [locale],
			});
		}
	}

	{
		const [, author, post] =
			/^content\/([^\/]+)\/posts\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (author) {
			console.log(`validating post: ${post}`);
			const locale = getLanguageFromFilename(file);
			const postInfo = await readPost({
				kind: "post",
				slug: post,
				file: path.join(process.cwd(), file),
				locale,
				locales: [locale],
				authors: [author],
			});
		}
	}

	{
		const [, author, collection] =
			/^content\/([^\/]+)\/collections\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (author) {
			console.log(`validating collection: ${collection}`);
			const locale = getLanguageFromFilename(file);
			const collectionInfo = await readCollection({
				kind: "collection",
				slug: collection,
				file: path.join(process.cwd(), file),
				locale,
				locales: [locale],
				authors: [author],
			});
		}
	}

	{
		const [, author, collection, post] =
			/^content\/([^\/]+)\/collections\/([^\/]+)\/posts\/([^\/]+)\/[^\/]+\.md$/.exec(
				file,
			) ?? [];
		if (author) {
			console.log(`validating post: ${post}`);
			const locale = getLanguageFromFilename(file);
			const postInfo = await readPost({
				kind: "post",
				slug: post,
				file: path.join(process.cwd(), file),
				locale,
				locales: [locale],
				authors: [author],
				collection,
			});
		}
	}
}

console.log("Done!");
