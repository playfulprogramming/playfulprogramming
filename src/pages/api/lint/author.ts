import type { APIRoute } from "astro";
import { getMarkdownHtml } from "#src/utils/markdown/getMarkdownHtml.ts";
import Type from "typebox";
import Value from "typebox/value";
import type { Locale } from "#src/paraglide/runtime.js";
import { people } from "#src/utils/data.ts";
import { getMarkdownVFile } from "#src/utils/markdown/getMarkdownVFile.ts";
import { readPerson } from "#src/utils/content/readPerson.ts";

const RequestSchema = Type.Object({
	author: Type.String(),
	locale: Type.Unsafe<Locale>(Type.String()),
});

export const POST: APIRoute = async ({ request }) => {
	const body = Value.Parse(RequestSchema, await request.json());
	const stub = people.get(body.author)?.find((p) => p.locale === body.locale);

	if (!stub) {
		console.log(`No match for author ${body.author}`);
		return Response.json({ warnings: [] });
	}

	const vfile = await getMarkdownVFile(stub);
	const post = await readPerson(stub, vfile);
	await getMarkdownHtml(post);

	return Response.json({
		warnings: vfile.data.warnings,
	});
};
