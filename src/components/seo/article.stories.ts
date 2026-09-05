import preview from "../../../.storybook/preview.ts";
import Demo, {
	type Props,
} from "../../../.storybook/fixtures/seo-article.astro";
import { person } from "../../../.storybook/fixtures.ts";
const meta = preview.type<{ args: Props }>().meta({
	title: "Astro/SEO/Article",
	component: Demo,
	args: {
		peopleData: [person],
		publishedTime: "2026-01-15",
		editedTime: "2026-02-01",
		keywords: ["javascript", "accessibility"],
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
