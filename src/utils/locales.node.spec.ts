import { describe, expect, test } from "vitest";
import { m } from "#src/paraglide/messages.js";
import { getLanguageFromFilename, localeToOpenGraph } from "./locales.ts";

describe("utils/locales.ts", () => {
	test("converts locale codes for Open Graph", () => {
		expect(localeToOpenGraph("en")).toBe("en");
		expect(localeToOpenGraph("pt-br")).toBe("pt_BR");
	});

	test("reads locale suffixes from content filenames", () => {
		expect(getLanguageFromFilename("index.es.md")).toBe("es");
		expect(getLanguageFromFilename("index.md")).toBe("en");
		expect(getLanguageFromFilename("/posts/test/index.fr.md")).toBe("fr");
	});

	test("uses Paraglide fallbacks and named interpolation", () => {
		expect(m.label_view_profile_for({ name: "Ada" }, { locale: "it" })).toBe(
			"Visualizza profilo di Ada",
		);
		expect(m.title_home({}, { locale: "fr" })).toBe("Home");
	});
});
