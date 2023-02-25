import { MarkdownInstance } from "astro";
import { Languages } from "types/index";

export const getOtherAboutLocales = (
	locale: Languages,
	globResults: Array<MarkdownInstance<Record<string, any>>>
) => {
	const matchedResult = globResults.find((aboutUs) => {
		if (locale === "en") {
			return aboutUs.file.endsWith("about-us.md");
		} else {
			return aboutUs.file.endsWith(`about-us.${locale}.md`);
		}
	});

	const allLocales = globResults.reduce((arr, globItem) => {
		if (globItem.file.endsWith("about-us.md")) {
			arr.push("en");
			return arr;
		}
		// .es.md
		const fileEnding = globItem.file.split("about-us").at(-1);
		const locale: Languages = fileEnding.split(".")[1] as never;
		arr.push(locale);
		return arr;
	}, [] as Languages[]);

	const otherLocales = allLocales.filter((propLocale) => propLocale !== locale);
	return {
		matchedResult,
		otherLocales,
	};
};
