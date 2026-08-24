import { describe, expect, it, vi } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import { VFile } from "vfile";
import type { MarkdownVFile } from "../../types.ts";
import { rehypeParseComponents } from "../rehype-parse-components.ts";
import { rehypeTransformComponents } from "../rehype-transform-components.ts";
import { transformMermaid } from "./rehype-transform.ts";

vi.mock("../components.ts", () => ({
	createComponent: (component: string, props: object) => ({
		type: "playful-component",
		component,
		props,
		children: [],
	}),
	isComponentMarkup: (node: { type?: string }) =>
		node?.type === "playful-component-markup",
	isComponentNode: (node: { type?: string }) =>
		node?.type === "playful-component",
}));

const fileInfo = {
	kind: "post" as const,
	file: "mermaid-test.md",
};

function createVFile(value: string) {
	return new VFile({
		value,
		path: fileInfo.file,
		data: {
			...fileInfo,
			headingsWithIds: [],
		},
	}) as MarkdownVFile;
}

async function processMarkdown(value: string) {
	const vfile = createVFile(value);
	const processor = unified()
		.use(remarkParse)
		.use(remarkToRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeParseComponents)
		.use(rehypeTransformComponents, {
			components: { mermaid: transformMermaid },
		});
	const tree = await processor.run(processor.parse(vfile), vfile);

	return { tree, vfile };
}

function findComponent(
	nodes: Array<{ type?: string; component?: string }>,
	component: string,
) {
	return nodes.find(
		(node) => node.type === "playful-component" && node.component === component,
	);
}

describe("Mermaid markdown component", () => {
	it("transforms a wrapped Mermaid fence into a chart component", async () => {
		const source = [
			"<!-- ::start:mermaid -->",
			"```mermaid",
			"flowchart TD",
			"  A --> B",
			"```",
			"<!-- ::end:mermaid -->",
		].join("\n");

		const { tree, vfile } = await processMarkdown(source);
		const mermaid = findComponent(tree.children, "Mermaid");

		expect(vfile.data.isMermaidUsed).toBe(true);
		expect(mermaid).toMatchObject({
			type: "playful-component",
			component: "Mermaid",
			props: {
				graph: "flowchart TD\n  A --> B",
			},
		});
	});

	it("leaves an unwrapped Mermaid fence as a code block", async () => {
		const source = ["```mermaid", "flowchart TD", "  A --> B", "```"].join(
			"\n",
		);

		const { tree, vfile } = await processMarkdown(source);

		expect(vfile.data.isMermaidUsed).toBeUndefined();
		expect(findComponent(tree.children, "Mermaid")).toBeUndefined();
	});

	it("rejects a wrapped fence with a non-Mermaid language", async () => {
		const source = [
			"<!-- ::start:mermaid -->",
			"```text",
			"flowchart TD",
			"  A --> B",
			"```",
			"<!-- ::end:mermaid -->",
		].join("\n");
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);
		const consoleLog = vi
			.spyOn(console, "log")
			.mockImplementation(() => undefined);

		try {
			const { tree, vfile } = await processMarkdown(source);

			expect(vfile.data.isMermaidUsed).toBeUndefined();
			expect(findComponent(tree.children, "Mermaid")).toBeUndefined();
			expect(consoleError).toHaveBeenCalledWith(
				expect.stringContaining(
					"Mermaid must use a ```mermaid fenced code block.",
				),
			);
		} finally {
			consoleError.mockRestore();
			consoleLog.mockRestore();
		}
	});
});
