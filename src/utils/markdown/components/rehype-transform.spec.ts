import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import {
	RehypeComponentsProps,
	rehypeTransformComponents,
} from "./rehype-transform";
import rehypeStringify from "rehype-stringify";
import { keepContent } from "utils/markdown/components/keep-content";

function getChain(components: RehypeComponentsProps["components"]) {
	return unified()
		.use(remarkParse, { fragment: true } as never)
		.use(remarkToRehype, { allowDangerousHtml: true })
		.use(rehypeRaw, { passThrough: ["mdxjsEsm"] })
		.use(rehypeTransformComponents, {
			components,
		})
		.use(rehypeStringify, { allowDangerousHtml: true, voids: [] });
}

// Skipped, as these tests need to be configured to run without jsdom. They pass otherwise
describe.skip("Component transforms", () => {
	it("should handle single-line transforms", async () => {
		const chain = getChain({
			"component-name": keepContent,
		});

		const html = (
			await chain.process(
				`
<!-- ::component-name -->
	`.trim(),
			)
		).toString();

		expect(html).toMatchInlineSnapshot(`""`);
	});

	it("should handle start/end transforms", async () => {
		const chain = getChain({
			"component-name": keepContent,
		});

		const html = (
			await chain.process(
				`
<!-- ::start:component-name -->

Test

<!-- ::end:component-name -->
	`.trim(),
			)
		).toString();

		expect(html).toMatchInlineSnapshot(`
			"
			<p>Test</p>
			"
		`);
	});

	it("should handle nested transforms", async () => {
		const chain = getChain({
			"component-name": keepContent,
			"another-component": keepContent,
		});

		const html = (
			await chain.process(
				`
<!-- ::start:component-name -->

Before

<!-- ::start:another-component -->

Inside

<!-- ::end:another-component -->

After

<!-- ::end:component-name -->
	`.trim(),
			)
		).toString();

		expect(html).toMatchInlineSnapshot(`
			"
			<p>Before</p>

			<p>Inside</p>

			<p>After</p>
			"
		`);
	});
});
