import type { Languages } from "#types/index.ts";
import { languages } from "../constants/index.ts";
import { m } from "../paraglide/messages.js";
import { baseLocale, extractLocaleFromUrl } from "../paraglide/runtime.js";

function isLanguageKey(str: string | undefined): str is Languages {
	return str !== undefined && Object.keys(languages).includes(str);
}

/**
 * In our translations.json file, we choose to use a `eg-eg` format
 *
 * But, for example, Open Graph requires an `eg_EG` format. As such, this
 * code handles the parsing and converting of translation formats
 */
export function fileToOpenGraphConverter<T extends Languages>(
	lang: T,
): T extends `${infer Lang}-${infer Region}`
	? `${Lang}_${Uppercase<Region>}`
	: T {
	const splitLang = lang.split("-");
	if (splitLang.length === 1) return lang as never;
	return `${splitLang[0]}_${splitLang[1].toUpperCase()}` as never;
}

/**
 * Given a filename "index.es.md", return the language code.
 *
 * @example "index.es.md" -> "es"
 * @example "index.md" -> "en"
 * @example "/posts/test/index.fr.md" -> "fr"
 */
export function getLanguageFromFilename(name: string): Languages {
	const lang = name.split(".").at(-2);
	if (isLanguageKey(lang)) return lang;
	return "en";
}

/**
 * Given a URL, find the prefix language.
 *
 * @example "/es/posts/test" -> "es"
 * @example "/posts/test" -> "en"
 * @example "/es-es/posts/test" -> "es-es"
 */
export function getPrefixLanguageFromPath(path: string): Languages {
	// find the first non-empty path segment, e.g. ["", "en", "posts"] -> "en"
	const pathSegment = path.split("/").find((s) => !!s);

	if (isLanguageKey(pathSegment)) return pathSegment;
	return "en";
}

/**
 * Given a URL, remove the prefix language. Preserve whether or not `/` is present
 *
 * This is useful when trying to map out `hrefLang` and others
 *
 * @example "/es/posts/test" -> "/posts/test"
 * @example "/posts/test" -> "/posts/test"
 * @example "/es-es/posts/test" -> "/posts/test"
 * @example "es/posts/test" -> "posts/test"
 * @example "posts/test" -> "posts/test"
 * @example "es-es/posts/test" -> "posts/test"
 */
export function removePrefixLanguageFromPath(path: string) {
	let isFirst = true;

	return path
		.split("/")
		.filter((s) => {
			// only exclude the first non-empty str, if it matches a lang
			if (s && isFirst) {
				isFirst = false;
				if (isLanguageKey(s)) return false;
			}

			return true;
		})
		.join("/");
}

type TranslationKey = keyof typeof import("../../content/data/i18n/en.json");

type ParaglideMessage = (
	inputs?: Record<string, string>,
	options?: { locale?: Languages },
) => string;

const messageParameters: Partial<Record<TranslationKey, readonly string[]>> = {
	"label.view_license_for": ["displayName"],
	"label.view_attribution_for": ["displayName"],
	"title.n_chapters": ["count"],
	"title.n_articles": ["count"],
	"title.n_words": ["count"],
	"label.view_profile_for": ["name"],
	"action.view_all_chapters": ["count"],
};

/**
 * Translate a key into the associated value, according to /data/i18n
 *
 * If the key is untranslated, returns the "en" value and logs a warning.
 * If the key is entirely missing, throws an error.
 */
export function translate(
	astro: { url: URL },
	key: TranslationKey,
	...args: string[]
) {
	const lang =
		(extractLocaleFromUrl(astro.url) as Languages | undefined) ?? baseLocale;
	const parameterNames = messageParameters[key] ?? [];
	const inputs = Object.fromEntries(
		parameterNames.map((parameter, index) => [parameter, args[index]]),
	);

	return (m[key] as ParaglideMessage)(inputs, { locale: lang });
}
