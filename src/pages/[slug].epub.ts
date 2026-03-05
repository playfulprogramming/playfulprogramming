import type { APIRoute } from "astro";
import {
	getCollectionBySlug,
	getCollectionsByLang,
	getPostsByCollection,
} from "#utils/api";
import { generateCollectionEPub } from "#utils/epubs/generate-collection-epub";

export const GET: APIRoute = async ({ params }) => {
	const slug = String(params.slug);
	const collection = (await getCollectionBySlug(slug, "en"))!;
	const collectionPosts = await getPostsByCollection(slug, "en");

	const epub = await generateCollectionEPub(collection, collectionPosts);

	return new Response(Buffer.from(epub), {
		headers: {
			"Content-Type": "application/epub+zip",
		},
	});
};

export async function getStaticPaths() {
	const collections = await getCollectionsByLang("en");
	return collections.map((c) => ({ params: { slug: c.slug } }));
}
