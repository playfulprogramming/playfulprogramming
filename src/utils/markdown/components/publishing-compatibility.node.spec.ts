import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { Element } from "hast";
import { unified, type Processor } from "unified";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import { remarkCommentComponents } from "mdast-comment-components";
import { VFile } from "vfile";
import { createHtmlPlugins } from "../createHtmlPlugins.ts";
import { createEpubPlugins } from "../createEpubPlugins.ts";
import { rehypeRelativePaths } from "../rehype-relative-paths.ts";
import { rehypeEpubSnitipLinks } from "../snitip-link/rehype-transform-epub.ts";
import { remarkComponentDiagnostics } from "./remark-component-diagnostics.ts";
import { legacyParseComponents } from "./__fixtures__/legacy-parse-components.ts";
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
vi.mock("uuid", () => ({ v4: () => "fixture-scope" }));

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

/** Reuse the current production stages with only the migration boundary swapped. */
function legacyPipeline(current: Pick<Processor, "attachers">, epub: boolean) {
	const processor = unified();
	for (const [plugin, ...options] of current.attachers) {
		const attacher: unknown = plugin;
		if (
			plugin === remarkCommentComponents ||
			plugin === remarkComponentDiagnostics
		)
			continue;
		if (attacher === remarkToRehype) {
			processor.use(remarkToRehype, { allowDangerousHtml: true });
		} else if (attacher === rehypeRaw) {
			processor.use(rehypeRaw, { passThrough: ["mdxjsEsm"] });
		} else {
			processor.use(plugin, ...options);
		}
		if (plugin === (epub ? rehypeEpubSnitipLinks : rehypeRelativePaths)) {
			processor.use(legacyParseComponents);
		}
	}
	return processor;
}

function semantics(value: unknown): unknown {
	if (value instanceof Map) return [...value.entries()].map(semantics);
	if (Array.isArray(value)) return value.map(semantics);
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value)
				.filter(([key]) => key !== "position")
				.map(([key, entry]) => [key, semantics(entry)]),
		);
	}
	return value;
}

async function compare(source: string, epub = false, path = fixturePath) {
	const factory = epub ? createEpubPlugins : createHtmlPlugins;
	const current = factory(unified());
	const baseline = legacyPipeline(factory(unified()), epub);
	const actualFile = vfile(source, path);
	const baselineFile = vfile(source, path);
	const actual = await current.process(actualFile);
	const expected = await baseline.process(baselineFile);
	expect(semantics(actual.result ?? actual.value)).toEqual(
		semantics(expected.result ?? expected.value),
	);
	expect(semantics(actual.data)).toEqual(semantics(expected.data));
	return actual as MarkdownVFile;
}

describe("native component publishing compatibility", () => {
	it("preserves HTML transforms, component compiler output and VFile metadata", async () => {
		const actual = await compare(await readFile(fixturePath, "utf8"));
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
		expect(actual.data.isMermaidUsed).toBe(true);
		expect(actual.data.snitips?.has("native")).toBe(true);
		expect(actual.data.warnings).toEqual([]);
	});

	it("preserves EPUB gates, paths, details expansion, snitip text and references", async () => {
		const actual = await compare(await readFile(fixturePath, "utf8"), true);
		const output = String(actual);
		expect(output).toContain("Ebook-only information.");
		expect(output).not.toContain("Web-only information.");
		expect(output).toContain("hint__container");
		expect(output).toContain("2_references.xhtml#fixture-collection-1");
		expect(output).toContain("__fixtures__/image.png");
		expect(output).not.toContain("pfp-snitip:");
		expect(output).not.toContain("playful-component");
		expect(actual.data.warnings).toEqual([]);
	});

	it.each([
		"content/fennifith/posts/example/index.md",
		"src/views/collection-framework-field-guide/assets/code-block/index.md",
	])("preserves representative HTML publishing: %s", async (path) => {
		await compare(await readFile(path, "utf8"), false, resolve(path));
	});

	it("preserves framework field guide EPUB publishing", async () => {
		const path =
			"src/views/collection-framework-field-guide/assets/code-block/index.md";
		await compare(await readFile(path, "utf8"), true, resolve(path));
	});

	it("preserves compiled HTML for adjacent standalone components", async () => {
		const actual = await compare(
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
		const html = await compare(source);
		expect(JSON.stringify(html.result)).toContain('"component":"QuizResults"');
		const errors = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
		const logs = vi.spyOn(console, "log").mockImplementation(() => undefined);
		try {
			for (const processor of [
				createEpubPlugins(unified()),
				legacyPipeline(createEpubPlugins(unified()), true),
			]) {
				const file = vfile(source);
				await expect(processor.process(file)).rejects.toThrow();
				expect(file.data.warnings[0].message).toBe(
					"Unknown markdown component quiz",
				);
			}
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
				for (const processor of [
					factory(unified()),
					legacyPipeline(factory(unified()), epub),
				]) {
					const file = vfile("<!-- ::unknown-widget -->");
					await expect(processor.process(file)).rejects.toThrow();
					expect(file.data.warnings[0].message).toBe(
						"Unknown markdown component unknown-widget",
					);
				}
			} finally {
				errors.mockRestore();
				logs.mockRestore();
			}
		},
	);
});
