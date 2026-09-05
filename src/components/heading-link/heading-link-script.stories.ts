import preview from "../../../.storybook/preview.ts";
import Demo from "../../../.storybook/fixtures/heading-link.astro";
import { initializeHeadingLinks } from "./heading-link.ts";
const meta = preview.meta({
	title: "components/Heading Link Script",
	component: Demo,
	play: ({ canvasElement }) => {
		// Initialize this render directly, including when revisiting the story.
		initializeHeadingLinks(canvasElement);
	},
});
export const Default = meta.story({});
