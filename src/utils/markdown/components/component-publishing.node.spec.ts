import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Element } from "hast";
import { unified } from "unified";
import { VFile } from "vfile";
import { createHtmlPlugins } from "../createHtmlPlugins.ts";
import { createEpubPlugins } from "../createEpubPlugins.ts";
import type { MarkdownVFile } from "../types.ts";

// Keep real pipeline transforms and compilers; isolate external services, Astro
// component imports, image encoding and worker execution from these Node tests.
vi.mock("./components.ts", () => ({
	createComponent: (component: string, props: object, children = []) => ({
		type: "playful-component",
		component,
		props,
		children,
	}),
	isComponentMarkup: (node: { type?: string }) =>
		node?.type === "playful-component-markup",
	isComponentNode: (node: { type?: string }) =>
		node?.type === "playful-component",
	isHtmlNode: (node: { type?: string }) => node?.type === "html",
}));
vi.mock("#src/constants/env/index.ts", () => ({
	default: {
		MODE: "test",
		CI: false,
		SITE_URL: "https://playfulprogramming.com",
		GIT_COMMIT_REF: "main",
	},
}));
// This Node project uses the site's default JSX runtime. The imported markdown
// JSX helpers declare hastscript, so provide that runtime without Astro's Vite
// plugin stack.
vi.mock("preact/jsx-runtime", async () => import("hastscript/jsx-runtime"));
vi.mock("#utils/api.ts", () => ({
	getPersonById: async (id: string) => ({ id, name: id }),
	getTagById: (id: string) => ({ id, name: id }),
	getSnitipById: () => undefined,
	getPostBySlug: async () => undefined,
	getCollectionBySlug: async (slug: string) => ({ slug }),
	getPostsByCollection: async () => [{ order: 1 }],
}));
vi.mock("#utils/hoof/index.ts", () => ({
	getUrlMetadata: async () => ({
		title: "Fixture embed",
		banner: { src: "https://example.com/banner.png" },
	}),
}));
vi.mock("#utils/get-picture/index.ts", () => ({
	getPicture: (image: object) => ({ image, sources: [] }),
}));
vi.mock("#utils/get-image-size.ts", () => ({
	getImageSize: async () => ({ width: 640, height: 480 }),
}));
vi.mock("../shiki/shiki-pool.ts", () => ({
	runShiki: vi.fn(async (node: Element) => node),
}));
vi.mock("./code-embed/code-embed-shiki.ts", () => ({
	codeToHtml: async (code: string) => code,
}));
beforeEach(() => {
	vi.spyOn(crypto, "randomUUID").mockReturnValue(
		"00000000-0000-4000-8000-000000000000",
	);
});
afterEach(() => vi.restoreAllMocks());

const fixturePath = resolve(
	"src/utils/markdown/components/__fixtures__/publishing.md",
);

function vfile(source: string, path = fixturePath): MarkdownVFile {
	return new VFile({
		value: source,
		path,
		data: {
			kind: "post",
			file: path,
			slug: "component-test",
			frontmatter: { collection: "fixture-collection", order: 1 },
			headingIds: [],
			tableOfContents: [],
			snitips: new Map(),
			warnings: [],
		},
	}) as MarkdownVFile;
}

async function publish(source: string, epub = false, path = fixturePath) {
	const factory = epub ? createEpubPlugins : createHtmlPlugins;
	return factory(unified()).process(
		vfile(source, path),
	) as Promise<MarkdownVFile>;
}

describe("native component publishing", () => {
	it("preserves HTML transforms, component compiler output and VFile metadata", async () => {
		const actual = await publish(await readFile(fixturePath, "utf8"));
		const output = JSON.stringify(actual.result);
		for (const component of [
			"Tabs",
			"FileList",
			"Mermaid",
			"Hint",
			"LinkPreview",
			"User",
			"SnitipTemplate",
		]) {
			expect(output).toContain(`\"component\":\"${component}\"`);
		}
		expect(output).toContain("Web-only information.");
		expect(output).not.toContain("Ebook-only information.");
		expect(output).toContain(
			"/src/utils/markdown/components/__fixtures__/publishing.md",
		);
		expect(actual.data.isMermaidUsed).toBe(true);
		expect([...actual.data.snitips.keys()]).toEqual(["native"]);
		expect(actual.data.headingIds).toContain("native");
		expect(actual.data.tableOfContents).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ value: "A nested heading" }),
			]),
		);
		expect(actual.data.tableOfContents).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({ value: "Native parsing" }),
			]),
		);
		expect(actual.snitipScopeId).toBe("00000000-0000-4000-8000-000000000000");
		expect(actual.data.warnings).toEqual([]);
	});

	it("preserves EPUB gates, paths, details expansion, snitip text and references", async () => {
		const actual = await publish(await readFile(fixturePath, "utf8"), true);
		const output = String(actual);
		expect(output).toContain("Ebook-only information.");
		expect(output).not.toContain("Web-only information.");
		expect(output).toContain("hint__container");
		expect(output).toContain("2_references.xhtml#fixture-collection-1");
		expect(output).toContain("__fixtures__/image.png");
		expect(output).toContain("Expanded in EPUB.");
		expect(output).not.toContain("<details");
		expect(output).not.toContain("pfp-snitip:");
		expect(output).not.toContain("playful-component");
		expect(actual.data.warnings).toEqual([]);
	});

	it("publishes components and snitip metadata from the example post", async () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		vi.spyOn(console, "log").mockImplementation(() => undefined);
		const path = "content/fennifith/posts/example/index.md";
		const actual = await publish(
			await readFile(path, "utf8"),
			false,
			resolve(path),
		);
		const output = JSON.stringify(actual.result);
		for (const component of ["LinkPreview", "Mermaid", "SnitipTemplate"]) {
			expect(output).toContain(`\"component\":\"${component}\"`);
		}
		expect(output).toContain("This is regular text.");
		expect(actual.data.isMermaidUsed).toBe(true);
		expect([...actual.data.snitips.keys()]).toEqual(["nodejs", "programming"]);
		// The API test double has no global snitips, so only this external
		// reference remains unresolved; both local definitions are published.
		expect(actual.data.warnings).toEqual([
			expect.objectContaining({
				message:
					"Could not resolve snitip link to any known snitips: pfp-snitip:#javascript",
			}),
		]);
	});

	it("publishes framework field guide HTML tabs", async () => {
		const path =
			"src/views/collection-framework-field-guide/assets/code-block/index.md";
		const actual = await publish(
			await readFile(path, "utf8"),
			false,
			resolve(path),
		);
		expect(actual.result).toMatchObject([
			{
				component: "Tabs",
				props: {
					tabs: [
						{ name: "React", slug: "react" },
						{ name: "Angular", slug: "angular" },
						{ name: "Vue", slug: "vue" },
					],
				},
				children: [
					{ children: [{ innerHtml: expect.stringContaining("const Hello") }] },
					{
						children: [
							{ innerHtml: expect.stringContaining("class HelloWorldComp") },
						],
					},
					{ children: [{ innerHtml: expect.stringContaining("Hello.vue") }] },
				],
			},
		]);
		expect(actual.data.warnings).toEqual([]);
	});

	it("preserves framework field guide EPUB publishing", async () => {
		const path =
			"src/views/collection-framework-field-guide/assets/code-block/index.md";
		const actual = await publish(
			await readFile(path, "utf8"),
			true,
			resolve(path),
		);
		const output = String(actual);
		for (const title of ["React", "Angular", "Vue"]) {
			expect(output).toContain(`>${title}</`);
		}
		expect(output).toContain("const Hello");
		expect(output).toContain("class HelloWorldComp");
		expect(output).toContain("Hello.vue");
		expect(output).not.toContain("playful-component");
		expect(actual.data.warnings).toEqual([]);
	});

	it("preserves compiled HTML for adjacent standalone components", async () => {
		const actual = await publish(
			'<!-- ::user id="one" --><!-- ::user id="two" -->',
		);
		expect(actual.result).toMatchObject([
			{ component: "User", props: { author: { id: "one" } } },
			{ component: "User", props: { author: { id: "two" } } },
		]);
	});

	it("keeps quizzes supported in HTML and unsupported in EPUB", async () => {
		const source =
			"<!-- ::start:quiz -->\n\nA quiz body.\n\n<!-- ::end:quiz -->";
		const html = await publish(source);
		expect(JSON.stringify(html.result)).toContain('"component":"QuizResults"');
		const errors = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
		const logs = vi.spyOn(console, "log").mockImplementation(() => undefined);
		try {
			const file = vfile(source);
			await expect(
				createEpubPlugins(unified()).process(file),
			).rejects.toThrow();
			expect(file.data.warnings[0].message).toBe(
				"Unknown markdown component quiz",
			);
		} finally {
			errors.mockRestore();
			logs.mockRestore();
		}
	});

	it.each([false, true])(
		"preserves unknown-component publication errors (EPUB: %s)",
		async (epub) => {
			const factory = epub ? createEpubPlugins : createHtmlPlugins;
			const errors = vi
				.spyOn(console, "error")
				.mockImplementation(() => undefined);
			const logs = vi.spyOn(console, "log").mockImplementation(() => undefined);
			try {
				const file = vfile("<!-- ::unknown-widget -->");
				await expect(factory(unified()).process(file)).rejects.toThrow();
				expect(file.data.warnings[0].message).toBe(
					"Unknown markdown component unknown-widget",
				);
			} finally {
				errors.mockRestore();
				logs.mockRestore();
			}
		},
	);
});
