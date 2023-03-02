import { Languages } from "types/index";
import { languages } from "constants/index";
import { basename } from "path";

/**
 * In our translations.json file, we choose to use a `eg-eg` format
 *
 * But, for example, Open Graph requires an `eg_EG` format. As such, this
 * code handles the parsing and converting of translation formats
 */
export function fileToOpenGraphConverter<T extends Languages>(
	lang: T
): T extends `${infer Lang}-${infer Region}`
	? `${Lang}_${Uppercase<Region>}`
	: T {
	const splitLang = lang.split("-");
	if (splitLang.length === 1) return lang as never;
	return `${splitLang[0]}_${splitLang[1].toUpperCase()}` as never;
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

	if (Object.keys(languages).includes(pathSegment))
		return pathSegment as Languages;
	else return "en";
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
	const matchedLang = getPrefixLanguageFromPath(path);

	return path
		.split("/")
		.filter((s) => s !== matchedLang)
		.join("/");
}

// fetch translation files from /data/i18n
const i18n: Record<Languages, Map<string, string>> = Object.fromEntries(
	await Promise.all(
		Object.entries(import.meta.glob("../../content/data/i18n/*.json")).map(
			async ([file, content]) =>
				content().then((value: { default: Record<string, string> }) => {
					return [
						basename(file).split(".")[0],
						new Map(Object.entries(value.default)),
					];
				})
		)
	)
);

// warn about any values that do not have full translations
for (const key of i18n.en.keys()) {
	const missing = Object.entries(i18n)
		.filter(([, map]) => !map.has(key))
		.map(([lang]) => lang);

	if (missing.length) {
		console.log(
			`i18n: key "${key}" is missing from /content/data/i18n for languages: ${missing}`
		);
	}
}

/**
 * Translate a key into the associated value, according to /data/i18n
 *
 * If the key is untranslated, returns the "en" value and logs a warning.
 * If the key is entirely missing, throws an error.
 */
export function translate(astro: { url: URL }, key: string) {
	const lang = getPrefixLanguageFromPath(astro.url.pathname);
	let value = i18n[lang]?.get(key);

	if (!value) {
		console.warn(
			`Translation key "${key}" is not specified in /content/data/i18n/${lang}.json`
		);
		value = i18n.en.get(key);
	}

	if (!value) {
		throw `Translation key "${key}" does not exist.`;
	}

	return value;
}
