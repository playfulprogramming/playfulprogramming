import * as fs from "fs/promises";
import { join } from "path";
import { contentDirectory } from "#utils/data.ts";
import { getLanguageFromFilename } from "#utils/translations.ts";
import type { Languages } from "#types/index.ts";

export interface AboutPageProps {
	file: string;
	isFallback: boolean;
	locales: Languages[];
	locale: Languages;
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
	locale: Languages,
): AboutPageProps {
	const englishFile = files.find((file) => file.locale === "en");
	if (!englishFile) {
		throw new Error("Missing English about page content");
	}

	const data = files.find((file) => file.locale === locale) ?? englishFile;

	return {
		file: data.file,
		isFallback: data.locale !== locale,
		locales: files.map((file) => file.locale),
		locale,
	};
}
