export * from "./theme.ts";
import languageNames from "../../content/data/languages.json" with { type: "json" };
import type { Locale } from "#src/paraglide/runtime.js";

export const languages: Record<Locale, string> = languageNames;
