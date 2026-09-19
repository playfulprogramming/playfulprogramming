import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { VFile } from "vfile";
import {
	remarkCommentComponents,
	type RemarkCommentComponentsOptions,
} from "../src/index.ts";

function processor(options?: RemarkCommentComponentsOptions) {
	return unified().use(remarkParse).use(remarkCommentComponents, options);
}

describe("comment component diagnostics", () => {
	it.each(["Ordinary Markdown", "<!-- ::example -->"])(
		"leaves valid content unchanged without reporting: %s",
		(source) => {
			const pipeline = processor({ fatal: true });
			const file = new VFile(source);
			const tree = pipeline.parse(file);
			expect(pipeline.runSync(tree, file)).toBe(tree);
			expect(file.messages).toEqual([]);
		},
	);

	it("keeps parse() quiet even when fatal reporting is enabled", () => {
		const pipeline = processor({ fatal: true });
		const file = new VFile("<!-- ::end:example -->");
		const tree = pipeline.parse(file);
		expect(tree.data?.commentComponentDiagnostics).toMatchObject([
			{ ruleId: "unexpected-close" },
		]);
		expect(file.messages).toEqual([]);
	});

	it("reports positioned messages and preserves recovered content by default", () => {
		const pipeline = processor();
		const file = new VFile(
			"Before\n\n<!-- ::end:example -->\n\n<!-- ::start:example -->\n\nAfter",
		);
		const tree = pipeline.parse(file);
		const original = structuredClone(tree);
		const diagnostics = tree.data!.commentComponentDiagnostics!;
		expect(diagnostics.map((diagnostic) => diagnostic.ruleId)).toEqual([
			"unexpected-close",
			"missing-close",
		]);
		expect(pipeline.runSync(tree, file)).toBe(tree);
		expect(tree).toEqual(original);
		expect(file.messages).toHaveLength(diagnostics.length);
		for (const [index, diagnostic] of diagnostics.entries()) {
			expect(file.messages[index]).toMatchObject({
				reason: diagnostic.message,
				place: diagnostic.position,
				line: diagnostic.position.start.line,
				column: diagnostic.position.start.column,
				ruleId: diagnostic.ruleId,
				source: "mdast-comment-components",
				fatal: false,
			});
		}
		expect(tree.children.at(-1)).toMatchObject({
			type: "paragraph",
			children: [{ type: "text", value: "After" }],
		});
	});

	it("reports every diagnostic before failing in fatal mode", () => {
		const pipeline = processor({ fatal: true });
		const file = new VFile("<!-- ::end:first -->\n\n<!-- ::end:second -->");
		const tree = pipeline.parse(file);
		const diagnostics = tree.data!.commentComponentDiagnostics!;
		expect(diagnostics).toHaveLength(2);
		expect(() => pipeline.runSync(tree, file)).toThrow(
			"Malformed Markdown comment components.",
		);
		for (const [index, diagnostic] of diagnostics.entries()) {
			expect(file.messages[index]).toMatchObject({
				reason: diagnostic.message,
				ruleId: diagnostic.ruleId,
				place: diagnostic.position,
				fatal: false,
			});
		}
		expect(file.messages).toHaveLength(3);
		expect(file.messages.at(-1)).toMatchObject({
			reason: "Malformed Markdown comment components.",
			source: "mdast-comment-components",
			ruleId: "invalid-components",
			fatal: true,
		});
	});

	it("continues processing alongside diagnostics from other plugins", async () => {
		const pipeline = processor({ fatal: false })
			.use(() => (_, file) => {
				file.message("A downstream diagnostic", "other-plugin:example");
			})
			.use(remarkStringify);
		const file = new VFile("<!-- ::end:example -->");
		expect(await pipeline.process(file)).toBe(file);
		expect(String(file)).toBe("<!-- ::end:example -->\n");
		expect(file.messages).toMatchObject([
			{ source: "mdast-comment-components", ruleId: "unexpected-close" },
			{ source: "other-plugin", ruleId: "example" },
		]);
	});

	it("rejects process() in fatal mode after recording all parser diagnostics", async () => {
		const pipeline = processor({ fatal: true }).use(remarkStringify);
		const file = new VFile("<!-- ::end:first -->\n\n<!-- ::end:second -->");
		await expect(pipeline.process(file)).rejects.toThrow(
			"Malformed Markdown comment components.",
		);
		expect(file.messages.map((message) => message.ruleId)).toEqual([
			"unexpected-close",
			"unexpected-close",
			"invalid-components",
		]);
	});
});
