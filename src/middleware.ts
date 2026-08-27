import { defineMiddleware } from "astro:middleware";
import { paraglideMiddleware } from "./paraglide/server.js";
import { assertIsLocale, baseLocale, setLocale } from "./paraglide/runtime.js";

declare const __PARAGLIDE_SERVER_OUTPUT__: boolean;

const useRequestScopedLocales =
	import.meta.env.DEV || __PARAGLIDE_SERVER_OUTPUT__;

export const onRequest = defineMiddleware((context, next) => {
	if (useRequestScopedLocales) {
		return paraglideMiddleware(context.request, () => next());
	}

	setLocale(assertIsLocale(context.currentLocale ?? baseLocale));
	return next();
});
