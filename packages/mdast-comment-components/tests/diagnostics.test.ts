import { describe, expect, it, vi } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { VFile } from "vfile";
import {
	remarkCommentComponents,
	remarkComponentDiagnostics,
	type CommentComponentDiagnostic,
	type RemarkComponentDiagnosticsOptions,
} from "../src/index.ts";

function processor(options?: RemarkComponentDiagnosticsOptions) {
	return unified()
		.use(remarkParse)
		.use(remarkCommentComponents)
		.use(remarkComponentDiagnostics, options);
}

describe("comment component diagnostics", () => {
	it.each(["Ordinary Markdown", "<!-- ::example -->"])(
		"leaves valid content unchanged without reporting: %s",
		(source) => {
			const onDiagnostic = vi.fn();
			const pipeline = processor({ fatal: true, onDiagnostic });
			const file = new VFile(source);
			const tree = pipeline.parse(file);
			expect(pipeline.runSync(tree, file)).toBe(tree);
			expect(file.messages).toEqual([]);
			expect(onDiagnostic).not.toHaveBeenCalled();
		},
	);

	it("keeps parse() quiet even when fatal reporting is enabled", () => {
		const onDiagnostic = vi.fn();
		const pipeline = processor({ fatal: true, onDiagnostic });
		const file = new VFile("<!-- ::end:example -->");
		const tree = pipeline.parse(file);
		expect(tree.data?.commentComponentDiagnostics).toMatchObject([
			{ ruleId: "unexpected-close" },
		]);
		expect(file.messages).toEqual([]);
		expect(onDiagnostic).not.toHaveBeenCalled();
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

	it("reports every diagnostic and callback before failing in fatal mode", () => {
		const onDiagnostic = vi.fn(
			(diagnostic: CommentComponentDiagnostic, file: VFile) => {
				expect(file.messages.at(-1)).toMatchObject({
					reason: diagnostic.message,
					ruleId: diagnostic.ruleId,
					fatal: false,
				});
			},
		);
		const pipeline = processor({ fatal: true, onDiagnostic });
		const file = new VFile("<!-- ::end:first -->\n\n<!-- ::end:second -->");
		const tree = pipeline.parse(file);
		const diagnostics = tree.data!.commentComponentDiagnostics!;
		expect(diagnostics).toHaveLength(2);
		expect(() => pipeline.runSync(tree, file)).toThrow(
			"Malformed Markdown comment components.",
		);
		expect(onDiagnostic).toHaveBeenCalledTimes(2);
		for (const [index, diagnostic] of diagnostics.entries()) {
			expect(onDiagnostic.mock.calls[index][0]).toBe(diagnostic);
			expect(onDiagnostic.mock.calls[index][1]).toBe(file);
		}
		expect(file.messages).toHaveLength(3);
		expect(file.messages.at(-1)).toMatchObject({
			reason: "Malformed Markdown comment components.",
			source: "mdast-comment-components",
			ruleId: "invalid-components",
			fatal: true,
		});
	});

	it("invokes the callback without stopping processing when fatal is false", () => {
		const onDiagnostic = vi.fn();
		const pipeline = processor({ fatal: false, onDiagnostic });
		const file = new VFile("<!-- ::end:example -->");
		const tree = pipeline.parse(file);
		expect(pipeline.runSync(tree, file)).toBe(tree);
		expect(onDiagnostic).toHaveBeenCalledExactlyOnceWith(
			tree.data!.commentComponentDiagnostics![0],
			file,
		);
		expect(file.messages).toHaveLength(1);
	});
});
