import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkCommentComponents } from "../src/index.ts";

const parser = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkMath)
	.use(remarkCommentComponents);
const parse = (value: string) => parser.parse(value);

describe("native comment components", () => {
	it("constructs standalone and ranged nodes during parse()", () => {
		const tree = parse(
			'<!-- ::user id="crutchcorn" -->\n\n<!-- ::start:tabs -->\n\n## First tab\n\nHello **world**.\n\n<!-- ::end:tabs -->',
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				component: "user",
				form: "standalone",
				attributes: { id: "crutchcorn" },
				children: [],
			},
			{
				type: "playfulComponent",
				component: "tabs",
				form: "ranged",
				children: [{ type: "heading", depth: 2 }, { type: "paragraph" }],
			},
		]);
	});
	it("handles same-name and different-name nesting", () => {
		const tree = parse(
			"<!-- ::start:tabs -->\n\n<!-- ::start:tabs -->\n\nInside\n\n<!-- ::end:tabs -->\n\n<!-- ::start:hint -->\n\nOther\n\n<!-- ::end:hint -->\n\n<!-- ::end:tabs -->",
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				component: "tabs",
				children: [
					{
						type: "playfulComponent",
						component: "tabs",
						children: [{ type: "paragraph" }],
					},
					{
						type: "playfulComponent",
						component: "hint",
						children: [{ type: "paragraph" }],
					},
				],
			},
		]);
	});
	it("preserves block and inline Markdown extensions in a body", () => {
		const tree = parse(
			"<!-- ::start:hint -->\n\n- [x] A [link](https://example.com)\n- **B**\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n$$\nx^2\n$$\n\n<!-- ::end:hint -->",
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				children: [{ type: "list" }, { type: "table" }, { type: "math" }],
			},
		]);
	});
	it("keeps marker examples in code literal", () => {
		const tree = parse(
			"<!-- ::start:hint -->\n\n```html\n<!-- ::end:hint -->\n<!-- ::user -->\n```\n\n`<!-- ::user -->`\n\n<!-- ::end:hint -->",
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				children: [
					{ type: "code", value: "<!-- ::end:hint -->\n<!-- ::user -->" },
					{ type: "paragraph", children: [{ type: "inlineCode" }] },
				],
			},
		]);
	});
	it("falls back without losing following content for a missing closer", () => {
		const tree = parse(
			"Before\n\n<!-- ::start:hint -->\n\nFollowing\n\n## Unrelated",
		);
		expect(tree.children.map((node) => node.type)).toEqual([
			"paragraph",
			"html",
			"paragraph",
			"heading",
		]);
		expect(tree.data?.commentComponentDiagnostics).toMatchObject([
			{ ruleId: "missing-close" },
		]);
	});
	it("preserves unexpected closers and reports a diagnostic", () => {
		const tree = parse("<!-- ::end:hint -->\n\nFollowing");
		expect(tree.children).toMatchObject([
			{ type: "html", value: "<!-- ::end:hint -->" },
			{ type: "paragraph" },
		]);
		expect(tree.data?.commentComponentDiagnostics).toMatchObject([
			{ ruleId: "unexpected-close" },
		]);
	});
	it("recovers an unclosed inner component at the outer closer", () => {
		const tree = parse(
			"<!-- ::start:tabs -->\n\n<!-- ::start:hint -->\n\nInside\n\n<!-- ::end:tabs -->\n\nAfter",
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				component: "tabs",
				children: [{ type: "html" }, { type: "paragraph" }],
			},
			{ type: "paragraph" },
		]);
		expect(tree.data?.commentComponentDiagnostics).toMatchObject([
			{ ruleId: "missing-close" },
		]);
	});
	it("does not recognize markers within lists, blockquotes, or raw HTML elements", () => {
		const tree = parse(
			"> <!-- ::user -->\n\n- <!-- ::user -->\n\n<div>\n\n<!-- ::start:hint -->\n\nInside\n\n<!-- ::end:hint -->\n\n</div>\n\n<!-- ::user -->",
		);
		expect(tree.children.map((node) => node.type)).toEqual([
			"blockquote",
			"list",
			"html",
			"html",
			"paragraph",
			"html",
			"html",
			"playfulComponent",
		]);
		expect(tree.data?.commentComponentDiagnostics).toBeUndefined();
	});
	it("keeps ordinary comments and HTML unchanged", () => {
		const source = "<!-- ordinary -->\n\n<div>\n<!-- ::user -->\n</div>";
		expect(parse(source)).toEqual(unified().use(remarkParse).parse(source));
	});
	it("retains full component and child source positions with CRLF", () => {
		const source =
			"<!-- ::start:hint -->\r\n\r\nText\r\n\r\n<!-- ::end:hint -->";
		const tree = parse(source);
		expect(tree.children[0]).toMatchObject({
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 5, column: 20, offset: source.length },
			},
			children: [
				{
					position: {
						start: { line: 3, column: 1, offset: source.indexOf("Text") },
						end: { line: 3, column: 5, offset: source.indexOf("Text") + 4 },
					},
				},
			],
		});
	});
	it("normalizes HTML attributes exactly as the existing publisher", () => {
		const tree = parse(
			'<!-- ::USER ID="first" id="last" CLASS="one two" disabled data-nozoom title="A &amp; &#34;B&#34;" button-text="Read" button-href="/go" -->',
		);
		expect(tree.children[0]).toMatchObject({
			type: "playfulComponent",
			component: "user",
			attributes: {
				id: "first",
				className: "one two",
				disabled: "true",
				dataNozoom: "",
				title: 'A & "B"',
				"button-text": "Read",
				"button-href": "/go",
			},
		});
	});
	it.each(["> <div>", "- <div>"])(
		"scopes HTML context to its Markdown parent: %s",
		(prefix) => {
			const tree = parse(`${prefix}\n\n<!-- ::user -->`);
			expect(tree.children.at(-1)).toMatchObject({
				type: "playfulComponent",
				component: "user",
			});
		},
	);
	it("preserves closers that belong to list children", () => {
		const tree = parse(
			"<!-- ::start:a -->\n\n- nested\n  <!-- ::end:a -->\n\nAfter\n\n<!-- ::end:a -->",
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				children: [
					{
						type: "list",
						children: [{ children: [{ type: "paragraph" }, { type: "html" }] }],
					},
					{ type: "paragraph" },
				],
			},
		]);
		expect(tree.data).toBeUndefined();
	});
	it("preserves closers that belong to ordinary HTML children", () => {
		const tree = parse(
			"<!-- ::start:tabs -->\n\n<div>\n\n<!-- ::end:tabs -->\n\n</div>\n\nAfter",
		);
		expect(tree.children.map((node) => node.type)).toEqual([
			"html",
			"html",
			"html",
			"html",
			"paragraph",
		]);
		expect(tree.data?.commentComponentDiagnostics).toMatchObject([
			{ ruleId: "missing-close" },
		]);
	});
	it("closes after complete HTML without requiring a blank line", () => {
		const tree = parse(
			'<!-- ::start:no-ebook -->\n<iframe src="pfp-code:./example"></iframe>\n<!-- ::end:no-ebook -->',
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				component: "no-ebook",
				children: [{ type: "html" }],
			},
		]);
		expect(tree.data).toBeUndefined();
	});
	it.each(["<br/>", '<iframe src="example"></iframe>', "<div>Text</div>"])(
		"recognizes a marker after complete HTML without a blank line: %s",
		(html) => {
			const tree = parse(`${html}\n<!-- ::user -->`);
			expect(tree.children).toMatchObject([
				{ type: "html", value: html },
				{ type: "playfulComponent", component: "user" },
			]);
		},
	);
	it.each([
		"<!-- ::user --><!-- ::user -->",
		"<!-- ::user --> <!-- ::user -->",
	])("supports adjacent markers: %s", (source) => {
		expect(parse(source).children).toMatchObject([
			{ type: "playfulComponent" },
			{ type: "playfulComponent" },
		]);
	});
	it.each(["<!-- ::start: -->", "<!-- :: -->", "<!-- ::end: -->"])(
		"preserves and diagnoses invalid markers: %s",
		(source) => {
			const tree = parse(`${source}\n\nAfter`);
			expect(tree.children).toMatchObject([
				{ type: "html", value: source },
				{ type: "paragraph" },
			]);
			expect(tree.data?.commentComponentDiagnostics).toMatchObject([
				{ ruleId: "invalid-marker" },
			]);
		},
	);
	it("preserves mismatched closers without ending the component", () => {
		const tree = parse(
			"<!-- ::start:tabs -->\n\nBefore\n\n<!-- ::end:hint -->\n\nAfter\n\n<!-- ::end:tabs -->",
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				component: "tabs",
				children: [
					{ type: "paragraph" },
					{ type: "html", value: "<!-- ::end:hint -->" },
					{ type: "paragraph" },
				],
			},
		]);
		expect(tree.data?.commentComponentDiagnostics).toMatchObject([
			{ ruleId: "mismatched-close", position: { start: { line: 5 } } },
		]);
	});
	it.each([0, 1, 2, 3])("accepts %i spaces of root indentation", (spaces) => {
		const indentation = " ".repeat(spaces);
		const tree = parse(
			`${indentation}<!--\t::start:HINT\t-->\n\nText\n\n${indentation}<!--::end:hint-->`,
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				component: "hint",
				children: [{ type: "paragraph" }],
			},
		]);
	});
	it("keeps four-space indentation as literal code", () => {
		expect(parse("    <!-- ::user -->").children).toMatchObject([
			{ type: "code", value: "<!-- ::user -->" },
		]);
	});
	it("accepts multiline attributes and normalizes closing-name case", () => {
		const tree = parse(
			'<!--\n::start:hint\ntitle="Two words"\n-->\n\nText\n\n<!-- ::end:HINT -->',
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				component: "hint",
				attributes: { title: "Two words" },
				children: [{ type: "paragraph" }],
			},
		]);
	});
	it.each([
		"<!-- ordinary --><!-- ::user -->",
		"<!-- ::user -->Text",
		"<!-- ::user --><!-- ordinary -->",
		"<div></div><!-- ::user -->",
	])(
		"preserves unsupported mixed same-line HTML as ordinary HTML: %s",
		(source) => {
			expect(parse(source)).toEqual(unified().use(remarkParse).parse(source));
		},
	);
	it("keeps closers in multiline comments literal", () => {
		const tree = parse(
			"<!-- ::start:hint -->\n\n<!-- ordinary comment\n<!-- ::end:hint -->\n\nAfter\n\n<!-- ::end:hint -->",
		);
		expect(tree.children).toMatchObject([
			{
				type: "playfulComponent",
				children: [{ type: "html" }, { type: "paragraph" }],
			},
		]);
	});
	it("retains the legacy unquoted final attribute normalization", () => {
		expect(parse("<!-- ::custom label=value -->").children).toMatchObject([
			{ type: "playfulComponent", attributes: { label: "value/" } },
		]);
	});
});
