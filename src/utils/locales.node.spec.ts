import { describe, expect, test } from "vitest";
import { m } from "#src/paraglide/messages.js";
import {
	getLanguageFromFilename,
	getStaticLocalePaths,
	isValidLocaleRouteParam,
	localeToOpenGraph,
} from "./locales.ts";

describe("utils/locales.ts", () => {
	test("validates optional locale route parameters", () => {
		expect(isValidLocaleRouteParam(undefined)).toBe(true);
		expect(isValidLocaleRouteParam("fr")).toBe(true);
		expect(isValidLocaleRouteParam("pt-br")).toBe(true);
		expect(isValidLocaleRouteParam("en")).toBe(false);
		expect(isValidLocaleRouteParam("unknown")).toBe(false);
	});

	test("converts locale codes for Open Graph", () => {
		expect(localeToOpenGraph("en")).toBe("en");
		expect(localeToOpenGraph("pt-br")).toBe("pt_BR");
	});

	test("reads locale suffixes from content filenames", () => {
		expect(getLanguageFromFilename("index.es.md")).toBe("es");
		expect(getLanguageFromFilename("index.md")).toBe("en");
		expect(getLanguageFromFilename("/posts/test/index.fr.md")).toBe("fr");
	});

	test("builds unprefixed base and prefixed translated static paths", () => {
		const paths = getStaticLocalePaths();

		expect(paths).toContainEqual({
			params: { locale: undefined },
			props: { locale: "en" },
		});
		expect(paths).toContainEqual({
			params: { locale: "fr" },
			props: { locale: "fr" },
		});
		expect(paths.map(({ props }) => props.locale)).toEqual([
			"en",
			"es",
			"fr",
			"pt",
			"pt-br",
			"bn",
			"it",
		]);
	});

	test("uses Paraglide fallbacks and named interpolation", () => {
		expect(m.label_view_profile_for({ name: "Ada" }, { locale: "it" })).toBe(
			"Visualizza profilo di Ada",
		);
		expect(m.title_home({}, { locale: "fr" })).toBe("Home");
		expect(
			m.search_meta_query(
				{ query: "$& authored %s", siteTitle: "Playful Programming" },
				{ locale: "en" },
			),
		).toBe("$& authored %s | Playful Programming");
	});
});
