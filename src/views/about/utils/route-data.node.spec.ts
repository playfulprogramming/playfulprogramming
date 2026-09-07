import { describe, expect, test, vi } from "vitest";

vi.mock("#utils/data.ts", () => ({ contentDirectory: "/content" }));

import { createAboutProps } from "./route-data.ts";

describe("about page content lookup", () => {
	test("uses translated content when available", () => {
		expect(
			createAboutProps(
				[
					{ file: "/content/site/about-us.md", locale: "en" },
					{ file: "/content/site/about-us.fr.md", locale: "fr" },
				],
				"fr",
			),
		).toEqual({
			file: "/content/site/about-us.fr.md",
			isFallback: false,
			locales: ["en", "fr"],
		});
	});

	test("marks base-language content as a fallback for untranslated routes", () => {
		expect(
			createAboutProps(
				[{ file: "/content/site/about-us.md", locale: "en" }],
				"pt-br",
			),
		).toEqual({
			file: "/content/site/about-us.md",
			isFallback: true,
			locales: ["en"],
		});
	});

	test("keeps a translation available when base-language content is absent", () => {
		expect(
			createAboutProps(
				[{ file: "/content/site/about-us.fr.md", locale: "fr" }],
				"fr",
			),
		).toMatchObject({
			file: "/content/site/about-us.fr.md",
			isFallback: false,
		});
	});

	test("returns no page when neither requested nor fallback content exists", () => {
		expect(createAboutProps([], "en")).toBeUndefined();
		expect(
			createAboutProps(
				[{ file: "/content/site/about-us.fr.md", locale: "fr" }],
				"pt-br",
			),
		).toBeUndefined();
	});
});
