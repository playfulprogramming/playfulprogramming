import { describe, expect, it, vi } from "vitest";
import type { ElementContent } from "hast";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { VFile } from "vfile";
import type {
	ComponentMarkupNode,
	ComponentNode,
	PlayfulRoot,
} from "./components.ts";
import { rehypeParseComponents } from "./rehype-parse-components.ts";
import { rehypeValidateComponents } from "./rehype-validate-components.ts";
import { rehypeTransformComponents } from "./rehype-transform-components.ts";

vi.mock("./components.ts", () => ({
	isComponentMarkup: (node: { type?: string }) =>
		node?.type === "playful-component-markup",
	isComponentNode: (node: { type?: string }) =>
		node?.type === "playful-component",
}));

const position = {
	start: { line: 2, column: 3, offset: 8 },
	end: { line: 2, column: 18, offset: 23 },
};

function markup(): ComponentMarkupNode {
	return {
		type: "playful-component-markup",
		component: "hint",
		attributes: {},
		children: [],
		position,
	};
}

function rendered(): ComponentNode {
	return {
		type: "playful-component",
		component: "Hint",
		props: {},
		children: [],
		position,
	};
}

describe("component VFile diagnostics", () => {
	it("reports malformed markers and continues parsing subsequent components", async () => {
		const file = new VFile({
			path: "components.md",
			value: "<!-- :: -->\n<!-- ::hint -->",
		});
		const processor = unified()
			.use(rehypeParse, { fragment: true })
			.use(rehypeParseComponents);
		const tree = await processor.run(
			processor.parse(file) as PlayfulRoot,
			file,
		);

		expect(file.messages).toHaveLength(1);
		expect(file.messages[0]).toMatchObject({
			reason: "Unable to parse component: ",
			source: "rehype-parse-components",
			ruleId: "invalid-marker",
			fatal: false,
			line: 1,
			column: 1,
			place: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 12, offset: 11 },
			},
		});
		expect(tree.children).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: "comment", value: " :: " }),
				expect.objectContaining({
					type: "playful-component-markup",
					component: "hint",
				}),
			]),
		);
	});

	it.each([
		["markup", markup],
		["rendered", rendered],
	] as const)(
		"fails with a positioned message for a misplaced %s component",
		async (_, createNode) => {
			const tree: PlayfulRoot = {
				type: "root",
				children: [
					{
						type: "element",
						tagName: "div",
						properties: {},
						children: [createNode()] as unknown as ElementContent[],
					},
				],
			};
			const file = new VFile({ path: "components.md" });
			const processor = unified().use(rehypeValidateComponents);

			await expect(processor.run(tree, file)).rejects.toMatchObject({
				fatal: true,
				source: "rehype-validate-components",
				ruleId: "invalid-parent",
				place: position,
			});
			expect(file.messages).toHaveLength(1);
			expect(file.messages[0].reason).toBe(
				`Component ${createNode().component} cannot be placed in element!`,
			);
		},
	);

	it("accepts components inside other components", async () => {
		const outer = markup();
		outer.children = [rendered()];
		const tree: PlayfulRoot = { type: "root", children: [outer] };
		const file = new VFile({ path: "components.md" });

		await unified().use(rehypeValidateComponents).run(tree, file);

		expect(file.messages).toEqual([]);
	});

	it("preserves recoverable messages when a later unknown component fails", async () => {
		const file = new VFile({
			path: "components.md",
			value: "<!-- :: -->\n<!-- ::unknown -->",
		});
		const processor = unified()
			.use(rehypeParse, { fragment: true })
			.use(rehypeParseComponents)
			.use(rehypeValidateComponents)
			.use(rehypeTransformComponents, { components: {} });

		await expect(
			processor.run(processor.parse(file) as PlayfulRoot, file),
		).rejects.toMatchObject({
			reason: "Unknown markdown component unknown",
			fatal: true,
			source: "rehype-components",
			ruleId: "unknown-component",
			line: 2,
			column: 1,
		});
		expect(file.messages).toHaveLength(2);
		expect(file.messages[0]).toMatchObject({
			fatal: false,
			ruleId: "invalid-marker",
		});
		expect(file.messages[1]).toMatchObject({
			fatal: true,
			ruleId: "unknown-component",
		});
	});
});
