import { afterEach, describe, expect, it, vi } from "vitest";
import { fromHtml } from "hast-util-from-html";
import { unified } from "unified";
import { VFile } from "vfile";
import { getUrlMetadata } from "#utils/hoof/index.ts";
import { rehypeUnicornIFrameClickToRun } from "./rehype-transform.ts";

vi.mock("../components/index.ts", () => ({
	createComponent: (component: string, props: object) => ({
		type: "playful-component",
		component,
		props,
		children: [],
	}),
	isComponentMarkup: (node: { type: string }) =>
		node.type === "commentComponent",
}));
vi.mock("#utils/hoof/index.ts", () => ({ getUrlMetadata: vi.fn() }));
vi.mock("./platform-detectors/gist.ts", () => ({
	rehypeTransformGist: vi.fn(),
}));
vi.mock("./platform-detectors/video.ts", () => ({
	rehypeTransformVideo: vi.fn(),
}));
vi.mock("./platform-detectors/post.ts", () => ({
	rehypeTransformPost: vi.fn(),
}));

afterEach(() => vi.resetAllMocks());

describe("iframe diagnostics", () => {
	it("records a positioned fatal error for a nested iframe before fetching metadata", async () => {
		const file = new VFile({
			value: '<div><iframe src="https://example.com"></iframe></div>',
			path: "content/iframe.md",
		});
		const tree = fromHtml(String(file), { fragment: true });
		await expect(
			unified().use(rehypeUnicornIFrameClickToRun, {}).run(tree, file),
		).rejects.toMatchObject({
			reason: "Cannot process a nested iframe!",
			fatal: true,
		});
		expect(file.messages).toHaveLength(1);
		expect(file.messages[0]).toMatchObject({
			source: "rehype-iframe-click-to-run",
			ruleId: "nested-iframe",
			line: 1,
			column: 6,
		});
		expect(getUrlMetadata).not.toHaveBeenCalled();
	});

	it("retains the fallback embed and exception detail after a metadata failure", async () => {
		vi.mocked(getUrlMetadata).mockRejectedValueOnce(
			new Error("Network unavailable"),
		);
		const file = new VFile({
			value: '<iframe src="https://example.com"></iframe>',
			path: "content/iframe.md",
		});
		const tree = fromHtml(String(file), { fragment: true });
		await unified().use(rehypeUnicornIFrameClickToRun, {}).run(tree, file);
		expect(tree.children[0]).toMatchObject({
			type: "playful-component",
			component: "IframePlaceholder",
			props: { src: "https://example.com" },
		});
		expect(file.messages).toHaveLength(1);
		expect(file.messages[0]).toMatchObject({
			reason: "Could not fetch URL metadata! Error: Network unavailable",
			fatal: false,
			source: "rehype-iframe-click-to-run",
			ruleId: "metadata-fetch-failed",
			line: 1,
			column: 1,
		});
	});
});
