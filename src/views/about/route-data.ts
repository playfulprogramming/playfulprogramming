import * as fs from "fs/promises";
import { join } from "path";
import { contentDirectory } from "#utils/data.ts";
import { getLanguageFromFilename } from "#utils/locales.ts";

import { type Locale, baseLocale } from "#src/paraglide/runtime.js";

export interface AboutPageProps {
	file: string;
	isFallback: boolean;
	locales: Locale[];
	locale: Locale;
}

export async function getAboutFiles() {
	return (await fs.readdir(join(contentDirectory, "site")))
		.filter((filename) => filename.startsWith("about-us"))
		.map((filename) => ({
			file: join(contentDirectory, "site", filename),
			locale: getLanguageFromFilename(filename),
		}));
}

export function createAboutProps(
	files: Awaited<ReturnType<typeof getAboutFiles>>,
	locale: Locale,
): AboutPageProps {
	const baseFile = files.find((file) => file.locale === baseLocale);
	if (!baseFile) {
		throw new Error("Missing base-locale about page content");
	}

	const data = files.find((file) => file.locale === locale) ?? baseFile;

	return {
		file: data.file,
		isFallback: data.locale !== locale,
		locales: files.map((file) => file.locale),
		locale,
	};
}
