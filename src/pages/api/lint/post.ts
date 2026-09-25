import type { APIRoute } from "astro";
import { lintMarkdown } from "#src/utils/markdown/lintMarkdown.ts";
import Type from "typebox";
import Value from "typebox/value";
import type { Locale } from "#src/paraglide/runtime.js";
import { posts } from "#src/utils/data.ts";
import { readPost } from "#src/utils/content/readPost.ts";

const RequestSchema = Type.Object({
	author: Type.String(),
	collection: Type.Optional(Type.String()),
	post: Type.String(),
	locale: Type.Unsafe<Locale>(Type.String()),
});

export const POST: APIRoute = async ({ request }) => {
	const body = Value.Parse(RequestSchema, await request.json());
	const stub = posts.get(body.post)?.find((p) => p.locale === body.locale);

	if (!stub) {
		console.log(`No match for post ${body.post}`);
		return Response.json({ warnings: [] });
	}

	return Response.json({
		warnings: await lintMarkdown(stub, readPost),
	});
};
