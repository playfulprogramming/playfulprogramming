import type { APIRoute } from "astro";
import {
	getCollectionBySlug,
	getCollectionsByLang,
	getPostsByCollection,
} from "#utils/api.ts";
import { generateCollectionEPub } from "#utils/epubs/generate-collection-epub.ts";
import { baseLocale } from "#src/paraglide/runtime.js";

export const GET: APIRoute = async ({ params }) => {
	const slug = String(params.slug);
	const collection = (await getCollectionBySlug(slug, baseLocale))!;
	const collectionPosts = await getPostsByCollection(slug, baseLocale);

	const epub = await generateCollectionEPub(collection, collectionPosts);

	return new Response(Buffer.from(epub), {
		headers: {
			"Content-Type": "application/epub+zip",
		},
	});
};

export async function getStaticPaths() {
	const collections = await getCollectionsByLang(baseLocale);
	return collections.map((c) => ({ params: { slug: c.slug } }));
}
