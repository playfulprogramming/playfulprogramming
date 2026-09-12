import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import {
	commentComponents,
	commentComponentsFromMarkdown,
	commentComponentsToMarkdown,
	remarkCommentComponents,
} from "../src/index.ts";

const processor = unified()
	.use(remarkParse)
	.use(remarkCommentComponents)
	.use(remarkGfm)
	.use(remarkMath)
	.use(remarkStringify);

function semantics(value: unknown): unknown {
	return JSON.parse(
		JSON.stringify(value, (key, child) =>
			key === "position" || key === "data" ? undefined : child,
		),
	);
}

function roundTrip(markdown: string) {
	const tree = processor.parse(markdown);
	const result = processor.stringify(tree);
	expect(semantics(processor.parse(result))).toEqual(semantics(tree));
	return result;
}

describe("comment component serialization", () => {
	const fixtures = new URL("./fixtures/", import.meta.url);
	it.each(
		readdirSync(fixtures).filter((file) =>
			/^(features-\d+|field-guide-tabs)\.md$/.test(file),
		),
	)("round trips the self-contained publishing fixture %s", (file) => {
		const source = readFileSync(new URL(file, fixtures), "utf8");
		const tree = processor.parse(source);
		expect(tree.children.some((node) => node.type === "playfulComponent")).toBe(
			true,
		);
		roundTrip(source);
	});

	it("registers all three extensions as an attacher without a transformer", () => {
		const tree = processor.parse('<!-- ::user id="crutchcorn" -->');
		expect(tree.children[0].type).toBe("playfulComponent");
		expect(processor.stringify(tree)).toBe('<!-- ::user id="crutchcorn" -->\n');
	});

	it("exposes individual extensions without requiring Unified", () => {
		const source =
			"<!-- ::start:tabs -->\n\n## First tab\n\n<!-- ::end:tabs -->";
		const options = {
			extensions: [commentComponents()],
			mdastExtensions: [commentComponentsFromMarkdown()],
		};
		const tree = fromMarkdown(source, options);
		const output = toMarkdown(tree, {
			extensions: [commentComponentsToMarkdown()],
		});
		expect(semantics(fromMarkdown(output, options))).toEqual(semantics(tree));
	});

	it("keeps standalone and empty ranged components distinct", () => {
		expect(
			roundTrip("<!--::user-->\n\n<!-- ::start:tabs -->\n<!-- ::end:tabs -->"),
		).toBe("<!-- ::user -->\n\n<!-- ::start:tabs -->\n\n<!-- ::end:tabs -->\n");
	});

	it("serializes nested Markdown with the surrounding serializer's options", () => {
		const source = [
			"<!-- ::start:tabs -->",
			"",
			"## First tab",
			"",
			"<!-- ::start:no-ebook -->",
			"",
			"A **strong** word, ~~deleted~~ text, $x + y$, and a [link](./page).",
			"",
			"- First",
			"- Second",
			"",
			"| Name | Value |",
			"| ---- | ----- |",
			"| One  | Two   |",
			"",
			"<!-- ::end:no-ebook -->",
			"",
			"<!-- ::end:tabs -->",
		].join("\n");
		roundTrip(source);
		const custom = unified()
			.use(remarkParse)
			.use(remarkCommentComponents)
			.use(remarkStringify, { bullet: "+", strong: "_" });
		const output = custom.stringify(
			custom.parse("<!-- ::start:tabs -->\n\n- **Hi**\n\n<!-- ::end:tabs -->"),
		);
		expect(output).toContain("+ __Hi__");
	});

	it.each([
		'<!-- ::in-content-ad title="Fish &amp; chips &quot;today&quot;" button-text="Let&#39;s go" button-href="https://example.com/?a=1&amp;b=2" -->',
		'<!-- ::user ID=first id=second CLASS="a  b" for="field" tabindex="02" disabled data-foo="bar" aria-label="label" -->',
		'<!-- ::custom title="&lt;tag&gt; --&gt; &amp;quot; &#10; &#13;" download checked="no" draggable="false" -->',
		'<!-- ::custom accept="image/png,image/jpg" rel="next prev" title="a\tb" -->',
	])("preserves HTML-normalized attribute values: %s", (source) => {
		roundTrip(source);
	});

	it("preserves ordinary comments and literal marker examples", () => {
		roundTrip(
			[
				"<!-- ordinary comment -->",
				"",
				"`<!-- ::user -->`",
				"",
				"```markdown",
				"<!-- ::start:tabs -->",
				"<!-- ::end:tabs -->",
				"```",
				"",
				"<!-- ::start:tabs -->",
				"",
				"~~~markdown",
				"<!-- ::end:tabs -->",
				"~~~",
				"",
				"<!-- ::end:tabs -->",
			].join("\n"),
		);
	});
});
