import { Languages } from "types/index";
import { languages } from "constants/index";

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
  const langs = Object.keys(languages) as Languages[];
  const matchedLang = langs.find(
    (lang) => path.startsWith(lang) || path.startsWith("/" + lang)
  );
  if (!matchedLang) return path;
  if (path.startsWith("/")) return "/" + path.slice(matchedLang.length + 2);
  // +1 since "es/path" needs to axe the trailing "/"
  return path.slice(matchedLang.length + 1);
}
