import preview from "../../../.storybook/preview.ts";
import Demo, {
	type Props,
} from "../../../.storybook/fixtures/seo-open-graph.astro";

const meta = preview.type<{ args: Props }>().meta({
	title: "Astro/SEO/OpenGraph",
	component: Demo,
	args: {
		title: "Learning components",
		lang: "en",
		providedLangs: ["es"],
		currentPath: "https://playfulprogramming.com/posts/example",
		metaDescription: "A small example page",
		metaImage:
			"https://playfulprogramming.com/illustrations/illustration-community.svg",
		ogType: "article",
		siteMetadata: { title: "Playful Programming" },
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
