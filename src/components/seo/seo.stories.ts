import preview from "../../../.storybook/preview.ts";
import Demo, { type Props } from "../../../.storybook/fixtures/seo-seo.astro";
import { person } from "../../../.storybook/fixtures.ts";
const meta = preview.type<{ args: Props }>().meta({
	title: "Astro/SEO/SEO",
	component: Demo,
	args: {
		title: "Learning components",
		description: "A small example page",
		peopleData: [person],
		type: "article",
		publishedTime: "2026-01-15",
		providedLangs: ["en", "es"],
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
