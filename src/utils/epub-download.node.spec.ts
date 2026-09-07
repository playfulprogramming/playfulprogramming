import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, getStaticPaths } from "../pages/[slug].epub.ts";
import { generateCollectionEPub } from "./epubs/generate-collection-epub.ts";

vi.mock("#utils/data.ts", () => ({
	collections: new Map([
		[
			"public-book",
			[{ slug: "public-book", locale: "en", published: "2024-01-01" }],
		],
		[
			"localized-book",
			[{ slug: "localized-book", locale: "es", published: "2024-01-01" }],
		],
		[
			"custom-page-book",
			[
				{
					slug: "custom-page-book",
					locale: "en",
					published: "2024-01-01",
					pageLayout: "none",
				},
			],
		],
		[
			"excluded-book",
			[
				{
					slug: "excluded-book",
					locale: "en",
					published: "2024-01-01",
					noindex: true,
				},
			],
		],
	]),
	posts: new Map(),
	people: new Map(),
	roles: [],
	tags: new Map(),
	snitips: new Map(),
}));

vi.mock("#src/paraglide/runtime.js", () => ({
	baseLocale: "en",
	localizeHref: (href: string) => href,
}));

vi.mock("./epubs/generate-collection-epub.ts", () => ({
	generateCollectionEPub: vi.fn(async () => new Uint8Array([80, 75, 3, 4])),
}));

async function download(slug: string) {
	return await GET({ params: { slug } } as unknown as Parameters<
		typeof GET
	>[0]);
}

describe("EPUB downloads", () => {
	beforeEach(() => {
		vi.mocked(generateCollectionEPub).mockClear();
	});

	it("preserves generated paths, including fallback locales and custom collection pages", () => {
		expect(
			getStaticPaths()
				.map(({ params }) => params.slug)
				.sort(),
		).toEqual(["custom-page-book", "localized-book", "public-book"]);
	});

	it.each(["public-book", "localized-book", "custom-page-book"])(
		"serves the existing generated download for %s",
		async (slug) => {
			const response = await download(slug);
			expect(response.status).toBe(200);
			expect(response.headers.get("Content-Type")).toBe("application/epub+zip");
			expect(new Uint8Array(await response.arrayBuffer())).toEqual(
				new Uint8Array([80, 75, 3, 4]),
			);
			expect(generateCollectionEPub).toHaveBeenCalledExactlyOnceWith(
				expect.objectContaining({ slug }),
				[],
			);
		},
	);

	it.each(["missing-book", "excluded-book"])(
		"returns 404 without generating an EPUB for %s",
		async (slug) => {
			expect((await download(slug)).status).toBe(404);
			expect(generateCollectionEPub).not.toHaveBeenCalled();
		},
	);
});
