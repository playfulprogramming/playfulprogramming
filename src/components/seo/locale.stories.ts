import preview from "../../../.storybook/preview.ts";
import Demo, {
	type Props,
} from "../../../.storybook/fixtures/seo-locale.astro";

const meta = preview.type<{ args: Props }>().meta({
	title: "Astro/SEO/Locale",
	component: Demo,
	args: {
		providedLangs: ["en", "es", "fr"],
		pathName: "/posts/example",
		siteMetadata: { siteUrl: "https://playfulprogramming.com" },
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
