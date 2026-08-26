import type { Element, Root } from "hast";
import { unified } from "unified";
import { VFile } from "vfile";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { rehypeValidateHeadingLinks } from "./rehype-validate-heading-links.ts";
import type { MarkdownVFile } from "./types.ts";

function markdownFile(headingSlugs: string[] = []): MarkdownVFile {
	return new VFile({
		value: "",
		path: "/content/test/index.md",
		data: {
			kind: "post",
			file: "/content/test/index.md",
			headingsWithIds: headingSlugs.map((slug) => ({
				value: slug,
				depth: 2,
				slug,
			})),
			snitips: new Map(),
		},
	}) as MarkdownVFile;
}

async function validate(tree: Root, file = markdownFile()): Promise<void> {
	await unified().use(rehypeValidateHeadingLinks).run(tree, file);
}

function anchor(href: string, id?: string): Element {
	return {
		type: "element",
		tagName: "a",
		properties: { href, ...(id ? { id } : {}) },
		children: [],
	};
}

describe("rehypeValidateHeadingLinks", () => {
	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => undefined);
		vi.spyOn(console, "error").mockImplementation(() => undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("accepts links to final element and component IDs", async () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "element",
					tagName: "span",
					properties: { id: "cool-id🦦🦦🦦" },
					children: [],
				},
				anchor("#cool-id%F0%9F%A6%A6%F0%9F%A6%A6%F0%9F%A6%A6"),
				{
					type: "element",
					tagName: "li",
					properties: { id: "user-content-fn-1" },
					children: [],
				},
				anchor("#user-content-fn-1", "user-content-fnref-1"),
				anchor("#user-content-fnref-1"),
				{
					type: "playful-component",
					component: "QuizRadio",
					props: {},
					fragmentIds: ["why-does-js"],
					children: [],
				},
				anchor("#why-does-js"),
			],
		} as unknown as Root;

		await validate(tree);

		expect(console.error).not.toHaveBeenCalled();
	});

	test("corrects the case of links to headings", async () => {
		const link = anchor("#mixed-case-heading");
		const tree: Root = {
			type: "root",
			children: [
				{
					type: "element",
					tagName: "h2",
					properties: { id: "Mixed-Case-Heading" },
					children: [],
				},
				link,
			],
		};

		await validate(tree, markdownFile(["Mixed-Case-Heading"]));

		expect(link.properties["href"]).toBe("#Mixed-Case-Heading");
		expect(console.error).toHaveBeenCalledOnce();
		expect(vi.mocked(console.error).mock.calls.flat().join(" ")).toContain(
			"has wrong case",
		);
	});

	test("reports genuinely missing and malformed fragment targets", async () => {
		const tree: Root = {
			type: "root",
			children: [anchor("#missing"), anchor("#bad%escape")],
		};

		await validate(tree);

		expect(console.error).toHaveBeenCalledTimes(2);
		expect(vi.mocked(console.error).mock.calls.flat().join(" ")).toContain(
			'Unknown anchor link to heading "#missing"',
		);
	});
});
