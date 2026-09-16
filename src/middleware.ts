import { defineMiddleware } from "astro:middleware";
import { paraglideMiddleware } from "./paraglide/server.js";

export const onRequest = defineMiddleware((context, next) => {
	// Prerendered pages also run concurrently. Each render needs its own locale
	// context so an awaited lookup cannot inherit another page's language.
	// Static builds have a URL but no incoming request headers.
	const request = context.isPrerendered
		? new Request(context.request.url)
		: context.request;
	return paraglideMiddleware(request, () => next());
});
