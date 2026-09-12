import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { Root } from "hast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkCommentComponents } from "mdast-comment-components";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import { VFile } from "vfile";
import { legacyParseComponents } from "./__fixtures__/legacy-parse-components.ts";
import type { ComponentMarkupNode, PlayfulRoot } from "./components.ts";
import { componentToHast } from "./component-to-hast.ts";

vi.mock("../logger.ts", () => ({ logError: vi.fn() }));

async function legacy(source: string): Promise<PlayfulRoot> {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkToRehype, { allowDangerousHtml: true })
		.use(rehypeRaw);
	const file = new VFile(source);
	const tree = (await processor.run(
		processor.parse(source),
		file,
	)) as PlayfulRoot;
	assertSafeLegacyRanges(tree);
	return unified().use(legacyParseComponents).run(tree, file);
}

// The frozen parser hangs for some malformed ranges. Fail the comparison
// clearly before invoking that baseline; malformed recovery has package tests.
function assertSafeLegacyRanges(tree: PlayfulRoot) {
	for (let index = 0; index < tree.children.length; index++) {
		const node = tree.children[index];
		if (node.type !== "comment") continue;
		const component = /^\s*::start:([\w-]+)/.exec(node.value)?.[1];
		if (!component) continue;
		const end = tree.children.findIndex(
			(child, offset) =>
				offset > index &&
				child.type === "comment" &&
				child.value === ` ::end:${component.toLowerCase()} `,
		);
		if (end < 0) throw new Error(`Unsafe legacy range: ${node.value}`);
		assertSafeLegacyRanges({
			type: "root",
			children: tree.children.slice(index + 1, end),
		});
		index = end;
	}
}

async function native(source: string): Promise<PlayfulRoot> {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkCommentComponents)
		.use(remarkToRehype, {
			allowDangerousHtml: true,
			handlers: { playfulComponent: componentToHast },
		})
		.use(rehypeRaw, { passThrough: ["playful-component-markup"] });
	const parsed = processor.parse(source);
	expect(parsed.data?.commentComponentDiagnostics ?? []).toEqual([]);
	return processor.run(parsed, new VFile(source)) as Promise<PlayfulRoot>;
}

function semantics(value: unknown, parentType?: string): unknown {
	if (Array.isArray(value))
		return value.map((child) => semantics(child, parentType));
	if (value && typeof value === "object") {
		const node = value as { type?: string; value?: string };
		// Published delimiters have surrounding spaces (ecosystem linters,
		// line 462; fundamentals side-effects, line 2432). Native parsing
		// canonicalizes those block separators. Compare
		// only root/component block separators semantically; inline, code and
		// raw HTML whitespace remain exact.
		const blockSeparator =
			(parentType === "root" || parentType === "playful-component-markup") &&
			node.type === "text" &&
			/^[\t \r\n]*\n[\t \r\n]*$/.test(node.value ?? "");
		return Object.fromEntries(
			Object.entries(value)
				.filter(([key]) => key !== "position")
				.map(([key, child]) => [
					key,
					key === "value" && blockSeparator
						? "\n"
						: semantics(child, key === "children" ? node.type : undefined),
				]),
		);
	}
	return value;
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
		(node): node is ComponentMarkupNode =>
			node.type === "playful-component-markup",
	);
}

describe("legacy component compatibility baseline", () => {
	it("captures actual ranged/standalone syntax and different-name nesting", async () => {
		const source = await readFile(
			new URL("./__fixtures__/components.md", import.meta.url),
			"utf8",
		);
		const nodes = components(await legacy(source));
		expect(nodes.map((node) => node.component)).toEqual([
			"tabs",
			"in-content-ad",
			"user",
			"filetree",
			"only-ebook",
		]);
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
		const tree = await legacy(
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
			const tree = await legacy(source);
			expect(components(tree)).toEqual([]);
			expect(JSON.stringify(tree)).not.toContain("playful-component-markup");
		},
	);

	it("preserves ordinary comments and raw HTML", async () => {
		const tree = (await legacy(
			"<!-- ordinary -->\n\n<div><em>HTML</em></div>",
		)) as Root;
		expect(tree.children[0]).toMatchObject({
			type: "comment",
			value: " ordinary ",
		});
		expect(tree.children[2]).toMatchObject({ type: "element", tagName: "div" });
	});
});

describe("native HAST bridge compatibility", () => {
	it.each(["<svg/>", "<math/>", "<p>Paragraph\n\n# Heading"])(
		"keeps a component after HTML that closes before the marker: %s",
		async (prefix) => {
			const source = `${prefix}\n\n<!-- ::user -->`;
			const actual = await native(source);
			expect(components(actual)).toHaveLength(1);
			expect(semantics(actual)).toEqual(semantics(await legacy(source)));
		},
	);

	it("retains the legacy normalization of a final unquoted attribute", async () => {
		const source = "<!-- ::user id=unquoted -->";
		expect(components(await native(source))[0].attributes).toEqual({
			id: "unquoted/",
		});
		expect(semantics(await native(source))).toEqual(
			semantics(await legacy(source)),
		);
	});

	it("preserves complete component positions and recursively parses raw HTML", async () => {
		const source =
			"<!-- ::start:tabs -->\n\n# Heading\n\n<div><em>Raw HTML</em></div>\n\n<!-- ::end:tabs -->";
		const actual = components(await native(source))[0];
		expect(actual.position).toMatchObject({
			start: { line: 1, column: 1, offset: 0 },
			end: { offset: source.length },
		});
		expect(actual.children).toContainEqual(
			expect.objectContaining({
				type: "element",
				tagName: "div",
				children: [expect.objectContaining({ tagName: "em" })],
			}),
		);
		expect(semantics(actual)).toEqual(
			semantics(components(await legacy(source))[0]),
		);
	});

	it.each([
		"> <!-- ::user id=literal -->",
		"- <!-- ::user id=literal -->",
		"<div>\n\n<!-- ::user id=literal -->\n\n</div>",
		"<div>\n\n<!-- ::start:tabs -->\n\n## Literal\n\n<!-- ::end:tabs -->\n\n</div>",
		"    <!-- ::user id=literal -->",
		"`<!-- ::user id=literal -->`",
		"```markdown\n<!-- ::user id=literal -->\n```",
	])("preserves legacy placement and literal examples: %s", async (source) => {
		expect(semantics(await native(source))).toEqual(
			semantics(await legacy(source)),
		);
	});

	it("leaves FEATURES.md fenced component documentation literal", async () => {
		const source = await readFile("FEATURES.md", "utf8");
		expect(components(await native(source))).toEqual([]);
		expect(semantics(await native(source))).toEqual(
			semantics(await legacy(source)),
		);
	});

	it("canonicalizes trailing marker whitespace only at a block boundary", async () => {
		const source =
			"<!-- ::start:tabs -->\n# Tab\n<!-- ::end:tabs --> \n\nAfter";
		const actual = await native(source);
		const expected = await legacy(source);
		expect(actual.children[1]).toMatchObject({ type: "text", value: "\n" });
		expect(expected.children[1]).toMatchObject({ type: "text", value: " \n" });
		expect(semantics(actual)).toEqual(semantics(expected));
	});

	it.each(corpus)(
		"preserves component-bearing corpus HAST: %s",
		async (path) => {
			const source = await readFile(path, "utf8");
			expect(semantics(await native(source))).toEqual(
				semantics(await legacy(source)),
			);
		},
	);
});
