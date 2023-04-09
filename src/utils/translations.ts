import { Languages } from "types/index";
import { languages } from "constants/index";
import { basename } from "path";
import { MarkdownInstance } from "astro";

function isLanguageKey(str: string): str is Languages {
	return Object.keys(languages).includes(str);
}

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

	if (isLanguageKey(pathSegment)) return pathSegment;
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

/**
 * Gets a translated markdown page from Astro, based on the current URL locale.
 *
 * @param astro the Astro global instance
 * @param glob the Astro glob to query
 * @returns the matched markdown page
 */
export function getTranslatedPage(
	astro: { url: URL },
	glob: MarkdownInstance<Record<string, unknown>>[]
): {
	locales: Languages[];
	page: MarkdownInstance<Record<string, unknown>>;
} {
	const globResults = glob;
	const lang = getPrefixLanguageFromPath(astro.url.pathname);

	const matchedResult = globResults.find((md) =>
		md.file.endsWith(`${lang}.md`)
	);
	const enResult = globResults.find((md) => md.file.split(".")[1] === "md");

	const locales = globResults
		.map((md) => md.file.split(".")[1])
		.filter(isLanguageKey);

	return {
		locales,
		page: matchedResult || enResult,
	};
}

// fetch translation files from /data/i18n
let i18nFiles: Record<string, unknown>;
try {
	i18nFiles = import.meta.glob("../../content/data/i18n/*.json", {
		eager: true,
	});
} catch (e) {
	i18nFiles = {};
}

const i18n: Partial<Record<Languages, Map<string, string>>> =
	Object.fromEntries(
		Object.entries(i18nFiles).map(
			([file, content]: [string, { default: Record<string, string> }]) => [
				basename(file).split(".")[0],
				new Map(Object.entries(content.default)),
			]
		)
	);

// warn about any values that do not have full translations
for (const key of i18n.en?.keys() || []) {
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
export function translate(astro: { url: URL }, key: string, ...args: string[]) {
	const lang = getPrefixLanguageFromPath(astro.url.pathname);
	let value = i18n[lang]?.get(key);

	if (value) {
		// replace any instances of "%s" with the corresponding argument
		//   ignoring double escapes (%%s)
		for (const arg of args) {
			value = value.replace(/(?<!%)%s/, arg).replace(/%%s/g, "%s");
		}
	}

	if (!value) {
		console.warn(
			`Translation key "${key}" is not specified in /content/data/i18n/${lang}.json`
		);
		value = i18n.en?.get(key);
	}

	if (!value) {
		throw `Translation key "${key}" does not exist.`;
	}

	return value;
}
