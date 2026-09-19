import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Root } from "hast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkCommentComponents } from "mdast-comment-components";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import { VFile } from "vfile";
import type { ComponentMarkupNode, PlayfulRoot } from "./components.ts";

async function parseComponents(source: string): Promise<PlayfulRoot> {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkCommentComponents)
		.use(remarkToRehype, {
			allowDangerousHtml: true,
			passThrough: ["commentComponent"],
		})
		.use(rehypeRaw, { passThrough: ["commentComponent"] });
	const parsed = processor.parse(source);
	expect(parsed.data?.commentComponentDiagnostics ?? []).toEqual([]);
	return processor.run(parsed, new VFile(source)) as Promise<PlayfulRoot>;
}

async function componentFiles(directory: string): Promise<string[]> {
	const result: string[] = [];
	for (const entry of await readdir(directory, {
		withFileTypes: true,
		recursive: true,
	})) {
		if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
		const path = join(entry.parentPath, entry.name);
		if (/<!--\s*::/.test(await readFile(path, "utf8"))) result.push(path);
	}
	return result.sort();
}

const corpus = [
	...(await componentFiles("content")),
	...(await componentFiles(
		"src/views/collection-framework-field-guide/assets",
	)),
];

function components(tree: PlayfulRoot) {
	return tree.children.filter(
		(node): node is ComponentMarkupNode => node.type === "commentComponent",
	);
}

describe("component HAST passthrough", () => {
	it("captures actual ranged/standalone syntax and different-name nesting", async () => {
		const source = await readFile(
			new URL("./__fixtures__/components.md", import.meta.url),
			"utf8",
		);
		const nodes = components(await parseComponents(source));
		expect(nodes.map((node) => node.component)).toEqual([
			"tabs",
			"in-content-ad",
			"user",
			"filetree",
			"only-ebook",
		]);
		expect(nodes[0]).toMatchObject({
			type: "commentComponent",
			form: "ranged",
		});
		expect(nodes[1]).toMatchObject({
			type: "commentComponent",
			form: "standalone",
			children: [],
		});
		expect(
			components({ type: "root", children: nodes[0].children })[0],
		).toMatchObject({ component: "no-ebook" });
		expect(nodes[1].attributes).toEqual({
			title: "A & B",
			body: 'Quoted "text"',
			"button-text": "Read more",
			"button-href": "https://example.com/?a=1&b=2",
		});
	});

	it("normalizes HTML attributes, names, booleans, duplicates and entities", async () => {
		const tree = await parseComponents(
			'<!-- ::USER ID="first" id="last" CLASS="one two" disabled data-nozoom title="A &amp; &#34;B&#34;" button-text=Read -->',
		);
		expect(components(tree)[0]).toMatchObject({
			component: "user",
			attributes: {
				id: "first",
				className: "one two",
				disabled: "true",
				dataNozoom: "",
				title: 'A & "B"',
				"button-text": "Read/",
			},
		});
	});

	it.each([
		"> <!-- ::user id=literal -->",
		"- <!-- ::user id=literal -->",
		"<div>\n\n<!-- ::user id=literal -->\n\n</div>",
		"<div>\n\n<!-- ::start:tabs -->\n\n## Literal\n\n<!-- ::end:tabs -->\n\n</div>",
		"    <!-- ::user id=literal -->",
		"`<!-- ::user id=literal -->`",
		"```markdown\n<!-- ::user id=literal -->\n```",
	])(
		"does not discover components inside ordinary containers: %s",
		async (source) => {
			const tree = await parseComponents(source);
			expect(components(tree)).toEqual([]);
			expect(JSON.stringify(tree)).not.toContain("commentComponent");
		},
	);

	it("preserves ordinary comments and raw HTML", async () => {
		const tree = (await parseComponents(
			"<!-- ordinary -->\n\n<div><em>HTML</em></div>",
		)) as Root;
		expect(tree.children[0]).toMatchObject({
			type: "comment",
			value: " ordinary ",
		});
		expect(tree.children[2]).toMatchObject({ type: "element", tagName: "div" });
	});

	it.each(["<svg/>", "<math/>", "<p>Paragraph\n\n# Heading"])(
		"keeps a component after HTML that closes before the marker: %s",
		async (prefix) => {
			const source = `${prefix}\n\n<!-- ::user -->`;
			const actual = await parseComponents(source);
			expect(components(actual)).toMatchObject([
				{ component: "user", attributes: {}, children: [] },
			]);
			expect(actual.children.at(-1)).toBe(components(actual)[0]);
		},
	);

	it("normalizes a final unquoted attribute", async () => {
		const source = "<!-- ::user id=unquoted -->";
		expect(components(await parseComponents(source))[0].attributes).toEqual({
			id: "unquoted/",
		});
	});

	it("preserves component metadata and converts Markdown and raw HTML children", async () => {
		const source =
			"<!-- ::start:tabs -->\n\n# Heading\n\n<div><em>Raw HTML</em></div>\n\n<!-- ::end:tabs -->";
		const actual = components(await parseComponents(source))[0];
		expect(actual).toMatchObject({
			type: "commentComponent",
			component: "tabs",
			form: "ranged",
			attributes: {},
		});
		expect(actual.position).toMatchObject({
			start: { line: 1, column: 1, offset: 0 },
			end: { offset: source.length },
		});
		expect(actual.children[0]).toMatchObject({
			type: "element",
			tagName: "h1",
			children: [{ type: "text", value: "Heading" }],
		});
		expect(actual.children).toContainEqual(
			expect.objectContaining({
				type: "element",
				tagName: "div",
				children: [expect.objectContaining({ tagName: "em" })],
			}),
		);
	});

	it("leaves FEATURES.md fenced component documentation literal", async () => {
		const source = await readFile("FEATURES.md", "utf8");
		const tree = await parseComponents(source);
		expect(components(tree)).toEqual([]);
		expect(JSON.stringify(tree)).not.toContain("commentComponent");
	});

	it("canonicalizes trailing marker whitespace only at a block boundary", async () => {
		const source =
			"<!-- ::start:tabs -->\n# Tab\n<!-- ::end:tabs --> \n\nAfter";
		const actual = await parseComponents(source);
		expect(actual.children[1]).toMatchObject({ type: "text", value: "\n" });
		expect(actual.children[2]).toMatchObject({
			type: "element",
			tagName: "p",
			children: [{ type: "text", value: "After" }],
		});
	});

	it.each(corpus)(
		"parses component-bearing corpus files without diagnostics: %s",
		async (path) => {
			const source = await readFile(path, "utf8");
			await parseComponents(source);
		},
	);
});
