/**
 * In our translations.json file, we choose to use a `eg-eg` format
 *
 * But, for example, Open Graph requires an `eg_EG` format. As such, this
 * code handles the parsing and converting of translation formats
 */
import { Languages } from "types/index";

export function fileToOpenGraphConverter<T extends Languages>(
  lang: T
): T extends `${infer Lang}-${infer Region}`
  ? `${Lang}_${Uppercase<Region>}`
  : T {
  const splitLang = lang.split("-");
  if (splitLang.length === 1) return lang as never;
  return `${splitLang[0]}_${splitLang[1].toUpperCase()}` as never;
}
