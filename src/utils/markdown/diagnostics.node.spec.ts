import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VFile } from "vfile";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { remarkCommentComponents } from "mdast-comment-components";
import { getMarkdownWarnings, withMarkdownDiagnostics } from "./diagnostics.ts";

const mockEnv = vi.hoisted(() => ({ CI: false }));
vi.mock("#src/constants/env/index.ts", () => ({ default: mockEnv }));

beforeEach(() => {
	vi.clearAllMocks();
	mockEnv.CI = false;
	vi.spyOn(console, "log").mockImplementation(() => {});
	vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe("Markdown diagnostics reporting", () => {
	it("reports each message once across content and rendering boundaries", async () => {
		const file = new VFile({ path: "post.md" });
		await withMarkdownDiagnostics(file, async () => {
			await withMarkdownDiagnostics(file, () => {
				file.message("Invalid frontmatter", "frontmatter:invalid");
			});
			await withMarkdownDiagnostics(file, () => {
				file.message("Unknown heading", "headings:unknown");
			});
		});
		expect(console.error).toHaveBeenCalledTimes(2);
		expect(getMarkdownWarnings(file).map((warning) => warning.message)).toEqual(
			["Invalid frontmatter", "Unknown heading"],
		);
	});

	it("reports earlier plugin messages and all component errors before rethrowing", async () => {
		const file = new VFile({
			path: "post.md",
			value: "<!-- ::end:first -->\n\n<!-- ::end:second -->",
		});
		const processor = unified()
			.use(remarkParse)
			.use(() => (_, file) => {
				file.message("Earlier diagnostic", "other-plugin:example");
			})
			.use(remarkCommentComponents, { fatal: true });
		await expect(
			withMarkdownDiagnostics(file, () =>
				processor.run(processor.parse(file), file),
			),
		).rejects.toBe(file.messages.at(-1));
		expect(file.messages.map((message) => message.ruleId)).toEqual([
			"example",
			"unexpected-close",
			"unexpected-close",
			"invalid-components",
		]);
		expect(console.error).toHaveBeenCalledTimes(4);
	});

	it("reports recorded messages even when an unrelated exception stops processing", async () => {
		const file = new VFile();
		const error = new Error("Service unavailable");
		await expect(
			withMarkdownDiagnostics(file, () => {
				file.message("Missing link", "links:missing");
				throw error;
			}),
		).rejects.toBe(error);
		expect(console.error).toHaveBeenCalledExactlyOnceWith(
			expect.stringContaining("Missing link"),
		);
	});

	it("prints the original source range at offset zero after compilation replaces the value", async () => {
		const file = new VFile({ path: "post.md", value: "original" });
		await withMarkdownDiagnostics(file, () => {
			file.message("Invalid text", {
				place: {
					start: { line: 1, column: 1, offset: 0 },
					end: { line: 1, column: 9, offset: 8 },
				},
			});
			file.value = "<p>compiled</p>";
		});
		expect(console.log).toHaveBeenCalledWith("\toriginal");
		expect(getMarkdownWarnings(file)).toEqual([
			{ message: "Invalid text", path: "post.md", offset: 0, col: 1, line: 1 },
		]);
	});

	it("formats source-independent CI annotations with escaped paths and messages", async () => {
		mockEnv.CI = true;
		const file = new VFile({ path: "content/a,b%.md" });
		await expect(
			withMarkdownDiagnostics(file, () => {
				file.info("Processing", "third-party:status");
				file.message("Bad\nvalue%", {
					place: { start: { line: 2, column: 3 }, end: { line: 4, column: 5 } },
					source: "unrelated-plugin",
				});
				file.fail("Cannot continue");
			}),
		).rejects.toThrow("Cannot continue");
		expect(vi.mocked(console.error).mock.calls).toEqual([
			["::notice file=content/a%2Cb%25.md::Processing"],
			[
				"::warning file=content/a%2Cb%25.md,col=3,endColumn=5,line=2,endLine=4::Bad%0Avalue%25",
			],
			["::error file=content/a%2Cb%25.md::Cannot continue"],
		]);
		expect(getMarkdownWarnings(file).map((warning) => warning.message)).toEqual(
			["Bad\nvalue%", "Cannot continue"],
		);
	});

	it("supports point locations and files without a path", async () => {
		const file = new VFile();
		await withMarkdownDiagnostics(file, () => {
			file.message("A point", { place: { line: 1, column: 1, offset: 0 } });
		});
		expect(getMarkdownWarnings(file)).toEqual([
			{ message: "A point", path: "", offset: 0, col: 1, line: 1 },
		]);
	});

	it("resolves relative paths against the VFile's working directory", async () => {
		const file = new VFile({
			cwd: "/tmp/markdown-project",
			path: "content/post.md",
		});
		await withMarkdownDiagnostics(file, () => {
			file.message("Invalid metadata");
		});
		expect(getMarkdownWarnings(file)[0].path).toBe("content/post.md");
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining("in content/post.md"),
		);
	});
});
