import { Languages } from "types/index";
import * as translations from "./translations";

describe("utils/translations.ts", () => {
	describe("fileToOpenGraphConverter", () => {
		test("converts a lang without hyphen", () => {
			const expected = "en";
			const actual = translations.fileToOpenGraphConverter("en");

			expect(actual).toEqual(expected);
		});

		test("converts a lang with hyphen", () => {
			const expected = "en_US";
			// TODO: "as never" is a hacky workaround for not having any examples of this case in the Languages type
			const actual = translations.fileToOpenGraphConverter("en-us" as never);

			expect(actual).toEqual(expected);
		});
	});

	describe("getLanguageFromFilename", () => {
		test("returns a the language from 'index.es.md'", () => {
			const lang = translations.getLanguageFromFilename("index.es.md");
			expect(lang).toBe("es");
		});

		test("returns 'en' from 'index.md'", () => {
			const lang = translations.getLanguageFromFilename("index.md");
			expect(lang).toBe("en");
		});

		test("returns 'fr' from '/posts/test/index.fr.md'", () => {
			const lang = translations.getLanguageFromFilename(
				"/posts/test/index.fr.md",
			);
			expect(lang).toBe("fr");
		});
	});

	describe("getPrefixLanguageFromPath", () => {
		test("returns an initial prefix", () => {
			const expected: Languages = "fr";
			const actual = translations.getPrefixLanguageFromPath(
				`/${expected}/something/extra/en/fr/hi`,
			);

			expect(actual).toEqual(expected);
		});

		test("returns an initial prefix with no preceding slash", () => {
			const expected: Languages = "fr";
			const actual = translations.getPrefixLanguageFromPath(
				`${expected}/something/extra/en/fr/hi`,
			);

			expect(actual).toEqual(expected);
		});

		test("defaults to 'en' when no prefix is present", () => {
			const expected: Languages = "en";
			const actual = translations.getPrefixLanguageFromPath(`/something/fr/hi`);

			expect(actual).toEqual(expected);
		});
	});

	describe("removePrefixLanguageFromPath", () => {
		test("removes an initial prefix", () => {
			const lang: Languages = "fr";
			const actual = translations.removePrefixLanguageFromPath(
				`/${lang}/something/extra/hi`,
			);

			expect(actual).toEqual("/something/extra/hi");
		});

		test("removes an initial prefix with no preceding slash", () => {
			const lang: Languages = "fr";
			const actual = translations.removePrefixLanguageFromPath(
				`${lang}/something/extra/hi`,
			);

			expect(actual).toEqual("something/extra/hi");
		});

		test("does not remove anything when no prefix is present", () => {
			const expected = "/something/post/hi";
			const actual = translations.removePrefixLanguageFromPath(expected);

			expect(actual).toEqual(expected);
		});

		test("is not confused by prefixes that appear after the start of the path", () => {
			const lang: Languages = "en";
			const actual = translations.removePrefixLanguageFromPath(
				`/${lang}/${lang}/es/fr/something/hi`,
			);

			expect(actual).toEqual(`/${lang}/es/fr/something/hi`);
		});
	});
});
