import type { Element, Root } from "hast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { unified } from "unified";
import { rehypeShikiUU } from "./rehype-transform.ts";
import { runShiki } from "./shiki-pool.ts";

vi.mock("./shiki-pool.ts", () => ({
	runShiki: vi.fn(),
}));

function createCodeBlock(language: string): Element {
	return {
		type: "element",
		tagName: "pre",
		properties: {},
		children: [
			{
				type: "element",
				tagName: "code",
				properties: { className: ["example", `language-${language}`] },
				children: [{ type: "text", value: "example" }],
			},
		],
	};
}

async function highlight(tree: Root): Promise<Root> {
	return unified().use(rehypeShikiUU).run(tree);
}

describe("rehypeShikiUU", () => {
	beforeEach(() => {
		vi.mocked(runShiki).mockReset();
	});

	it("leaves Mermaid code blocks untouched", async () => {
		const mermaid = createCodeBlock("mermaid");
		const tree: Root = { type: "root", children: [mermaid] };

		const result = await highlight(tree);

		expect(runShiki).not.toHaveBeenCalled();
		expect(result.children[0]).toBe(mermaid);
	});

	// TODO(shiki-removal): remove with the shiki fallback
	it("highlights languages twinkleplop does not support with shiki", async () => {
		const cpp = createCodeBlock("cpp");
		const highlighted = createCodeBlock("highlighted-cpp");
		vi.mocked(runShiki).mockResolvedValueOnce(highlighted);
		const tree: Root = { type: "root", children: [cpp] };

		const result = await highlight(tree);

		expect(runShiki).toHaveBeenCalledOnce();
		expect(runShiki).toHaveBeenCalledWith(cpp);
		expect(result.children[0]).toBe(highlighted);
	});

	it.each([
		["typescript", "", "const a = 1;\nconst b = 2;"],
		["ts", "{2}", "const a = 1;\nconst b = 2;"],
		["jsx", "", "const a = <div>{b}</div>;"],
		["bash", "", "echo hi # [!code highlight]"],
	])("highlights %s %s with twinkleplop", async (language, meta, text) => {
		const result = await highlightCode(language, meta, text);

		expect(runShiki).not.toHaveBeenCalled();
		expect(result.children[0]).toMatchSnapshot();
	});

	it.each(["{0}", "{3}", "{1-3}"])(
		"fails on line highlights %s outside the fence",
		async (meta) => {
			await expect(
				highlightCode("ts", meta, "const a = 1;\nconst b = 2;"),
			).rejects.toThrow();
		},
	);
});

function highlightCode(language: string, meta: string, text: string) {
	const code = createCodeBlock(language);
	(code.children[0] as Element).children = [{ type: "text", value: text }];
	(code.children[0] as Element).data = { meta: meta || undefined } as never;
	const tree: Root = { type: "root", children: [code] };
	return unified().use(rehypeShikiUU, { serialize: true }).run(tree);
}
