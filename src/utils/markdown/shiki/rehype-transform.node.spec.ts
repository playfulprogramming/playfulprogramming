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

	it("continues to highlight other code blocks", async () => {
		const typescript = createCodeBlock("typescript");
		const highlighted = createCodeBlock("highlighted-typescript");
		vi.mocked(runShiki).mockResolvedValueOnce(highlighted);
		const tree: Root = { type: "root", children: [typescript] };

		const result = await highlight(tree);

		expect(runShiki).toHaveBeenCalledOnce();
		expect(runShiki).toHaveBeenCalledWith(typescript);
		expect(result.children[0]).toBe(highlighted);
	});
});
