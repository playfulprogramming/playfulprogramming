import { describe, expect, it } from "vitest";
import { Type } from "typebox";
import { VFile } from "vfile";
import type { MarkdownVFile } from "../markdown/types.ts";
import { parseFrontmatter } from "./parseFrontmatter.ts";

function file(value: string): MarkdownVFile {
	return new VFile({
		value,
		path: "content/frontmatter.md",
		data: {
			kind: "page",
			file: "content/frontmatter.md",
			headingIds: [],
			tableOfContents: [],
			snitips: new Map(),
		},
	}) as MarkdownVFile;
}

describe("frontmatter diagnostics", () => {
	it("records a fatal diagnostic when frontmatter is missing", async () => {
		const vfile = file("# No frontmatter");
		await expect(
			parseFrontmatter(vfile, Type.Object({})),
		).rejects.toMatchObject({
			reason: "Missing frontmatter!",
			fatal: true,
		});
		expect(vfile.messages).toHaveLength(1);
		expect(vfile.messages[0]).toMatchObject({
			source: "parse-frontmatter",
			ruleId: "missing-frontmatter",
			line: 1,
			column: 1,
		});
	});

	it("keeps schema errors recoverable and preserves the frontmatter position", async () => {
		const vfile = file("---\n{ title: 42 }\n---\n\nBody");
		const result = await parseFrontmatter(
			vfile,
			Type.Object({ title: Type.String() }),
		);
		expect(result.frontmatter).toEqual({ title: 42 });
		expect(vfile.messages).toHaveLength(1);
		expect(vfile.messages[0]).toMatchObject({
			fatal: false,
			source: "parse-frontmatter",
			ruleId: "invalid-schema",
			line: 1,
			column: 1,
		});
		expect(vfile.messages[0].place).toEqual(result.frontmatterNode.position);
	});

	it("collects JSON and schema errors on the same file without throwing", async () => {
		const vfile = file("---\n{ title: }\n---");
		await expect(
			parseFrontmatter(vfile, Type.Object({ title: Type.String() })),
		).resolves.toBeDefined();
		expect(vfile.messages.map((message) => message.ruleId)).toContain(
			"invalid-json",
		);
		expect(vfile.messages.map((message) => message.ruleId)).toContain(
			"invalid-schema",
		);
		expect(vfile.messages.every((message) => message.fatal === false)).toBe(
			true,
		);
	});
});
