import { describe, expect, it, vi } from "vitest";
import type { Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { toString } from "hast-util-to-string";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import {
	type ComponentNode,
	type PlayfulNode,
	type PlayfulRoot,
	createComponent,
	isComponentNode,
	isHtmlNode,
} from "../components.ts";
import { rehypeValidateComponents } from "../rehype-validate-components.ts";
import { rehypeTransformComponents } from "../rehype-transform-components.ts";
import { rehypePluginComponents } from "../rehype-plugin-components.ts";
import { rehypeDetailsElement, transformDetails } from "./rehype-transform.ts";

vi.mock("../components.ts", () => ({
	createComponent: (
		component: string,
		props: object,
		children: ComponentNode["children"] = [],
	) => ({
		type: "playful-component",
		component,
		props,
		children,
	}),
	isComponentMarkup: (node: { type?: string }) =>
		node?.type === "playful-component-markup",
	isComponentNode: (node: { type?: string }) =>
		node?.type === "playful-component",
	isHtmlNode: (node: { type?: string }) => node?.type === "html",
}));

async function processMarkdown(value: string, wrapInComponent = false) {
	const processor = unified()
		.use(remarkParse)
		.use(remarkToRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(() => (tree: PlayfulRoot) => {
			if (wrapInComponent) {
				tree.children = [
					createComponent(
						"Tooltip",
						{ title: "Wrapper", icon: "info" },
						tree.children,
					),
				];
			}
		})
		.use(rehypeDetailsElement)
		.use(rehypeValidateComponents)
		.use(rehypeTransformComponents, {
			components: { hint: transformDetails },
		})
		.use(rehypePluginComponents, {
			htmlOptions: { allowDangerousHtml: true, voids: [] },
		});
	const file = await processor.process({ value, path: "details-test.md" });

	return file.result as PlayfulNode[];
}

// Stand in for Content.astro: HTML chunks and component output must concatenate
// into valid markup without losing the elements surrounding each component.
function renderComponents(nodes: ComponentNode["children"]): string {
	return nodes
		.map((node) => {
			if (isHtmlNode(node)) return node.innerHtml;
			if (node.type === "root") return renderComponents(node.children);
			if (isComponentNode(node)) {
				return toHtml(
					{
						type: "element",
						tagName: node.component.toLowerCase(),
						properties: {
							title: (node.props as { title: string }).title,
						},
						children: [{ type: "raw", value: renderComponents(node.children) }],
					},
					{ allowDangerousHtml: true },
				);
			}
			throw new Error(`Uncompiled node: ${node.type}`);
		})
		.join("");
}

function getComponents(nodes: ComponentNode["children"]): ComponentNode[] {
	return nodes.flatMap((node) => {
		if (isComponentNode(node)) return [node, ...getComponents(node.children)];
		if (node.type === "root") return getComponents(node.children);
		return [];
	});
}

describe("Details markdown component", () => {
	it.each([
		{ tagName: "ul", markers: ["-", "-", "-"] },
		{ tagName: "ol", markers: ["1.", "2.", "3."] },
	])(
		"transforms details inside a $tagName list item",
		async ({ tagName, markers }) => {
			const indent = " ".repeat(markers[1].length + 1);
			const source = [
				`${markers[0]} List item 1`,
				"",
				`${markers[1]} List item 2`,
				`${indent}<details>`,
				`${indent}  <summary>What's this?</summary>`,
				`${indent}  OwO`,
				`${indent}</details>`,
				"",
				`${markers[2]} List item 3`,
			].join("\n");

			const nodes = await processMarkdown(source);
			expect(getComponents(nodes)).toMatchObject([
				{ component: "Hint", props: { title: "What's this?" } },
			]);

			const html = renderComponents(nodes);
			const root = fromHtml(html, { fragment: true });
			const list = root.children.find(
				(node): node is Element =>
					node.type === "element" && node.tagName === tagName,
			);
			expect(list).toBeDefined();
			const items = list!.children.filter(
				(node): node is Element =>
					node.type === "element" && node.tagName === "li",
			);
			expect(
				items.map((node) => toString(node).replace(/\s+/g, " ").trim()),
			).toEqual(["List item 1", "List item 2 OwO", "List item 3"]);
			expect(
				items[1].children.filter((node) => node.type === "element"),
			).toMatchObject([
				{ tagName: "p" },
				{ tagName: "hint", properties: { title: "What's this?" } },
			]);
			expect(html).not.toContain("<details");
		},
	);

	it("preserves HTML siblings immediately before and after a component", async () => {
		const nodes = await processMarkdown(
			'<div class="wrapper" data-label="A &amp; B"><p>Before</p><details><summary>Title</summary>Body</details>tail<strong>After</strong></div>',
		);

		expect(renderComponents(nodes)).toBe(
			'<div class="wrapper" data-label="A &#x26; B"><p>Before</p><hint title="Title">Body</hint>tail<strong>After</strong></div>',
		);
	});

	it("preserves a top-level element immediately before a component", async () => {
		const nodes = await processMarkdown(
			"<p>Before</p><details><summary>Title</summary>Body</details><p>After</p>",
		);

		expect(renderComponents(nodes)).toBe(
			'<p>Before</p><hint title="Title">Body</hint><p>After</p>',
		);
	});

	it("transforms details nested directly inside details", async () => {
		const nodes = await processMarkdown(
			"<details><summary>Outer</summary>Before<details><summary>Inner</summary>Inside</details>After</details>",
		);

		expect(getComponents(nodes).map((node) => node.props)).toEqual([
			{ title: "Outer" },
			{ title: "Inner" },
		]);
		expect(renderComponents(nodes)).toBe(
			'<hint title="Outer">Before<hint title="Inner">Inside</hint>After</hint>',
		);
	});

	it("leaves details without a direct summary while transforming its nested details", async () => {
		const nodes = await processMarkdown(
			"<details>Before<details><summary>Inner</summary>Inside</details>After</details>",
		);

		expect(getComponents(nodes)).toMatchObject([
			{ component: "Hint", props: { title: "Inner" } },
		]);
		expect(renderComponents(nodes)).toBe(
			'<details>Before<hint title="Inner">Inside</hint>After</details>',
		);
	});

	it("transforms details beneath an already-created component", async () => {
		const nodes = await processMarkdown(
			"<div>Before<details><summary>Inner</summary>Inside</details>After</div>",
			true,
		);

		expect(getComponents(nodes).map((node) => node.component)).toEqual([
			"Tooltip",
			"Hint",
		]);
		expect(renderComponents(nodes)).toBe(
			'<tooltip title="Wrapper"><div>Before<hint title="Inner">Inside</hint>After</div></tooltip>',
		);
	});
});
