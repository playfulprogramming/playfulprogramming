import {
	baseLocale,
	isLocale,
	locales,
	type Locale,
} from "#src/paraglide/runtime.js";

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

/**
 * Astro's optional locale route uses `undefined` for the unprefixed base locale.
 * A supplied parameter must therefore be a configured, non-base locale.
 */
export function isValidLocaleRouteParam(locale: string | undefined): boolean {
	return locale === undefined || (isLocale(locale) && locale !== baseLocale);
}

export interface StaticLocalePath {
	params: { locale: Locale | undefined };
	props: { locale: Locale };
}

/** Build Astro static paths from Paraglide's generated locale configuration. */
export function getStaticLocalePaths(): StaticLocalePath[] {
	return locales.map((locale) => ({
		params: { locale: locale === baseLocale ? undefined : locale },
		props: { locale },
	}));
}
