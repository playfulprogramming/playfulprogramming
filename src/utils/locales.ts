import { baseLocale, isLocale, type Locale } from "#src/paraglide/runtime.js";

/** Convert a BCP 47 locale to the underscore format expected by Open Graph. */
export function localeToOpenGraph<T extends Locale>(
	locale: T,
): T extends `${infer Language}-${infer Region}`
	? `${Language}_${Uppercase<Region>}`
	: T {
	const [language, region] = locale.split("-");
	return (region ? `${language}_${region.toUpperCase()}` : language) as never;
}

/** Read the locale suffix used by localized Markdown files. */
export function getLanguageFromFilename(name: string): Locale {
	const locale = name.split(".").at(-2);
	return isLocale(locale) ? locale : baseLocale;
}
