import preview from "../../../../.storybook/preview.ts";
import Demo from "../../../../.storybook/fixtures/blocking-theme.astro";
const meta = preview.meta({
	title: "Astro/Blocking Theme Changer Script",
	component: Demo,
});
export const Default = meta.story({});
