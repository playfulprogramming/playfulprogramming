import type { APIRoute } from "astro";
import * as api from "#utils/api.ts";
import { getMarkdownHtml } from "#src/utils/markdown/getMarkdownHtml.ts";
import Type from "typebox";
import Value from "typebox/value";
import type { Locale } from "#src/paraglide/runtime.js";

const RequestSchema = Type.Object({
	author: Type.String(),
	collection: Type.String(),
	locale: Type.Unsafe<Locale>(Type.String()),
});

export const POST: APIRoute = async ({ request }) => {
	const body = Value.Parse(RequestSchema, await request.json());
	const entity = await api.getCollectionBySlug(body.collection, body.locale);

	if (!entity) {
		console.log(`No match for collection ${body.collection}`);
		return Response.json({ warnings: [] });
	}

	const data = await getMarkdownHtml(entity);

	return Response.json({
		warnings: data.warnings,
	});
};
