import preview from "../../../.storybook/preview.ts";
import Demo, { type Props } from "../../../.storybook/fixtures/seo-book.astro";
import { person } from "../../../.storybook/fixtures.ts";
const meta = preview.type<{ args: Props }>().meta({
	title: "Astro/SEO/Book",
	component: Demo,
	args: {
		peopleData: [person],
		publishedTime: "2026-01-15",
		isbn: "9780000000000",
	},
	play: async ({ canvasElement }) => {
		const tags = canvasElement.querySelector("[data-seo-tags]");
		const output = canvasElement.querySelector("[data-seo-output]");
		if (tags && output)
			output.textContent = Array.from(tags.children)
				.map((tag) => tag.outerHTML)
				.join("\n");
	},
});
export const Default = meta.story({});
