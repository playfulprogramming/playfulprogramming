import type { APIRoute } from "astro";
import {
	getCollectionBySlug,
	getCollectionsByLang,
	getPostsByCollection,
} from "#utils/api.ts";
import { generateCollectionEPub } from "#utils/epubs/generate-collection-epub.ts";

export const GET: APIRoute = async ({ params }) => {
	const slug = String(params.slug);
	const collection = getCollectionBySlug(slug, "en")!;
	const collectionPosts = getPostsByCollection(slug, "en");

	const epub = await generateCollectionEPub(collection, collectionPosts);

	return new Response(Buffer.from(epub), {
		headers: {
			"Content-Type": "application/epub+zip",
		},
	});
};

export function getStaticPaths() {
	const collections = getCollectionsByLang("en");
	return collections.map((c) => ({ params: { slug: c.slug } }));
}
