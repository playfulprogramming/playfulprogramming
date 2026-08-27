import { defineMiddleware } from "astro:middleware";
import { paraglideMiddleware } from "./paraglide/server.js";
import { assertIsLocale, baseLocale, setLocale } from "./paraglide/runtime.js";

const isServerBuild = process.env.BUILD_OUTPUT === "server";

export const onRequest = defineMiddleware((context, next) => {
	if (isServerBuild) {
		return paraglideMiddleware(context.request, ({ request }) => next(request));
	}

	setLocale(assertIsLocale(context.currentLocale ?? baseLocale));
	return next();
});
