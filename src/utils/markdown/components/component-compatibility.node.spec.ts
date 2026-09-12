import { readFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import type { Root } from "hast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import { VFile } from "vfile";
import { legacyParseComponents } from "./__fixtures__/legacy-parse-components.ts";
import type { ComponentMarkupNode, PlayfulRoot } from "./components.ts";

vi.mock("../logger.ts", () => ({ logError: vi.fn() }));

async function legacy(source: string): Promise<PlayfulRoot> {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkToRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(legacyParseComponents);
	return processor.run(processor.parse(source), new VFile(source));
}

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
