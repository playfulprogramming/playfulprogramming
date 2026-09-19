import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { VFile } from "vfile";
import remarkParse from "remark-parse";
import type { Processor } from "unified";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import { rehypeParseComponents } from "./components/rehype-parse-components.ts";
import { rehypeTransformComponents } from "./components/rehype-transform-components.ts";
import { getMarkdownVFile } from "./getMarkdownVFile.ts";
import { getMarkdownHtml } from "./getMarkdownHtml.ts";
import { lintMarkdown } from "./lintMarkdown.ts";
import { cache } from "../content/common.ts";
import type { MarkdownFileInfo, MarkdownVFile } from "./types.ts";

vi.mock("#src/constants/env/index.ts", () => ({
	default: { CI: false, DEV: false },
}));
vi.mock("./getMarkdownVFile.ts", () => ({ getMarkdownVFile: vi.fn() }));
vi.mock("./components/components.ts", () => ({
	isComponentMarkup: (node: { type: string }) =>
		node.type === "playful-component-markup",
	isComponentNode: (node: { type: string }) =>
		node.type === "playful-component",
}));
vi.mock("./createHtmlPlugins.ts", () => ({
	createHtmlPlugins: (processor: Processor) =>
		processor
			.use(remarkParse)
			.use(remarkToRehype, { allowDangerousHtml: true })
			.use(rehypeRaw)
			.use(rehypeParseComponents)
			.use(rehypeTransformComponents, { components: {} })
			.use(() => (_, file) => {
				file.message(
					`Rendering ${file.data.frontmatter && (file.data.frontmatter as MarkdownFileInfo).slug}`,
					"links:missing",
				);
			})
			.use(function () {
				this.compiler = () => "";
			}),
}));

const stub: MarkdownFileInfo = { kind: "post", file: "post.md", slug: "stub" };
let file: MarkdownVFile;

beforeEach(() => {
	vi.clearAllMocks();
	file = new VFile({
		value: "Content",
		path: stub.file,
		data: {
			kind: stub.kind,
			file: stub.file,
			frontmatter: stub,
			headingIds: [],
			tableOfContents: [],
			snitips: new Map(),
		},
	}) as MarkdownVFile;
	vi.mocked(getMarkdownVFile).mockResolvedValue(file);
	vi.spyOn(console, "log").mockImplementation(() => {});
	vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

it("collects frontmatter and rendering messages on the same file, reporting each once", async () => {
	const read = cache(async (stub: MarkdownFileInfo, vfile: MarkdownVFile) => {
		expect(vfile).toBe(file);
		vfile.message("Invalid metadata", "frontmatter:invalid");
		return { ...stub, slug: "resolved" };
	});
	expect(await lintMarkdown(stub, read)).toMatchObject([
		{ message: "Invalid metadata", path: "post.md" },
		{ message: "Rendering resolved", path: "post.md" },
	]);
	expect(getMarkdownVFile).toHaveBeenCalledTimes(1);
	expect(console.error).toHaveBeenCalledTimes(2);
});

it("returns fatal component diagnostics along with earlier content messages", async () => {
	file.value = "<!-- ::example -->";
	const warnings = await lintMarkdown(stub, async (stub, file) => {
		file.message("Invalid metadata", "frontmatter:invalid");
		return stub;
	});
	expect(warnings.map((warning) => warning.message)).toEqual([
		"Invalid metadata",
		"Unknown markdown component example",
	]);
	expect(console.error).toHaveBeenCalledTimes(2);
});

it("returns content failures before rendering starts", async () => {
	const warnings = await lintMarkdown(
		stub,
		cache(async (_, file) => {
			return file.fail("Missing frontmatter!", "frontmatter:missing");
		}),
	);
	expect(warnings).toMatchObject([{ message: "Missing frontmatter!" }]);
	expect(console.error).toHaveBeenCalledTimes(1);
});

it("keeps unrelated exceptions as failures and still reports preceding diagnostics", async () => {
	const error = new Error("Network unavailable");
	await expect(
		lintMarkdown(stub, async (_, file) => {
			file.message("Invalid metadata");
			throw error;
		}),
	).rejects.toBe(error);
	expect(console.error).toHaveBeenCalledTimes(1);
});

it("reports rendering failures when called outside the lint API", async () => {
	file.value = "<!-- ::example -->";
	await expect(getMarkdownHtml(stub, file)).rejects.toThrow(
		"Unknown markdown component example",
	);
	expect(console.error).toHaveBeenCalledTimes(1);
});

it("reports content failures when called outside the lint API", async () => {
	const read = cache(async (_: MarkdownFileInfo, file: MarkdownVFile) => {
		return file.fail("Missing frontmatter!", "frontmatter:missing");
	});
	await expect(read(stub)).rejects.toThrow("Missing frontmatter!");
	expect(console.error).toHaveBeenCalledTimes(1);
});
