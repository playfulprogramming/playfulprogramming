import type { APIRoute } from "astro";
import {
	getCollectionBySlug,
	getCollectionsByLang,
	getPostsByCollection,
} from "utils/api";
import { generateCollectionEPub } from "utils/epubs/generate-collection-epub";

export const GET: APIRoute = async ({ params }) => {
	const slug = String(params.slug);
	const collection = getCollectionBySlug(slug, "en")!;
	const collectionPosts = getPostsByCollection(slug, "en");

	if (!collection) {
		return new Response("Collection not found", { status: 404 });
	}

	const epub = await generateCollectionEPub(collection, collectionPosts);

	return new Response(Buffer.from(epub), {
		headers: {
			"Content-Type": "application/epub+zip",
		},
	});
};
