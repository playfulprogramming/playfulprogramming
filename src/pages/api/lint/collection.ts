import type { APIRoute } from "astro";
import { getMarkdownHtml } from "#src/utils/markdown/getMarkdownHtml.ts";
import Type from "typebox";
import Value from "typebox/value";
import type { Locale } from "#src/paraglide/runtime.js";
import { collections } from "#src/utils/data.ts";
import { readCollection } from "#src/utils/content/readCollection.ts";
import { getMarkdownVFile } from "#src/utils/markdown/getMarkdownVFile.ts";

const RequestSchema = Type.Object({
	author: Type.String(),
	collection: Type.String(),
	locale: Type.Unsafe<Locale>(Type.String()),
});

export const POST: APIRoute = async ({ request }) => {
	const body = Value.Parse(RequestSchema, await request.json());
	const stub = collections
		.get(body.collection)
		?.find((p) => p.locale === body.locale);

	if (!stub) {
		console.log(`No match for collection ${body.collection}`);
		return Response.json({ warnings: [] });
	}

	const vfile = await getMarkdownVFile(stub);
	const post = await readCollection(stub, vfile);
	await getMarkdownHtml(post);

	return Response.json({
		warnings: vfile.data.warnings,
	});
};
