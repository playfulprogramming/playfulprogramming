import type { APIRoute } from "astro";
import * as api from "#utils/api";
import { CollectionInfo, PersonInfo, PostInfo } from "../../types";
import { getLanguageFromFilename } from "../../utils";
import { getMarkdownHtml } from "#src/utils/markdown/getMarkdownHtml.ts";

export const GET: APIRoute = async ({ url }) => {
	const file = url.searchParams.get("file");
	if (!file) throw new Error("Missing required query parameter ?file=");

	const locale = getLanguageFromFilename(file);
	let entity: PersonInfo | CollectionInfo | PostInfo | undefined;

	{
		const [, author] = /^content\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (author) entity = await api.getPersonById(author, locale);
	}

	{
		const [, , post] =
			/^content\/([^\/]+)\/posts\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (post) entity = await api.getPostBySlug(post, locale);
	}

	{
		const [, , collection] =
			/^content\/([^\/]+)\/collections\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (collection) entity = await api.getCollectionBySlug(collection, locale);
	}

	{
		const [, , , post] =
			/^content\/([^\/]+)\/collections\/([^\/]+)\/posts\/([^\/]+)\/[^\/]+\.md$/.exec(
				file,
			) ?? [];
		if (post) entity = await api.getPostBySlug(post, locale);
	}

	if (!entity) {
		console.log(`No match for path ${file}`);
		return Response.json({ warnings: [] });
	}

	const data = await getMarkdownHtml(entity);

	return Response.json({
		warnings: data.warnings,
	});
};

export function getStaticPaths() {
	// This route should only be processed when BUILD_OUTPUT=server
	return [];
}
