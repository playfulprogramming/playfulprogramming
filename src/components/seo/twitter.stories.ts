import preview from "../../../.storybook/preview.ts";
import Demo, {
	type Props,
} from "../../../.storybook/fixtures/seo-twitter.astro";
import { person } from "../../../.storybook/fixtures.ts";
const meta = preview.type<{ args: Props }>().meta({
	title: "Astro/SEO/Twitter",
	component: Demo,
	args: {
		title: "Learning components",
		peopleData: [person],
		metaDescription: "A small example page",
		metaImage:
			"https://playfulprogramming.com/illustrations/illustration-community.svg",
		siteMetadata: { twitterHandle: "@playful_program" },
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
