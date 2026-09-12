import * as fs from "fs/promises";
import { join } from "path";
import { contentDirectory } from "#utils/data.ts";
import {
	getLanguageFromFilename,
	getStaticLocalePaths,
} from "#utils/locales.ts";

import { type Locale, baseLocale } from "#src/paraglide/runtime.js";

export interface AboutPageProps {
	file: string;
	isFallback: boolean;
	locales: Locale[];
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
): AboutPageProps | undefined {
	const data =
		files.find((file) => file.locale === locale) ??
		files.find((file) => file.locale === baseLocale);
	if (!data) return undefined;

	return {
		file: data.file,
		isFallback: data.locale !== locale,
		locales: files.map((file) => file.locale),
	};
}

export async function getAboutPaths() {
	const files = await getAboutFiles();
	return getStaticLocalePaths().flatMap(({ params, props }) => {
		const pageProps = createAboutProps(files, props.locale);
		return pageProps ? [{ params, props: pageProps }] : [];
	});
}
