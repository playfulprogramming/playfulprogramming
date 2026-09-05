import preview from "../../../.storybook/preview.ts";
import Demo from "../../../.storybook/fixtures/blocking-tabs.astro";
const meta = preview.meta({
	title: "Astro/Blocking Tabs Signal Script",
	component: Demo,
});
export const Default = meta.story({});
