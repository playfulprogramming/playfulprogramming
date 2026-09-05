import preview from "../../../../../.storybook/preview.ts";
import Demo from "../../../../../.storybook/fixtures/theme-sidebar.astro";
const meta = preview.meta({
	title: "components/Theme Sidebar Trigger",
	component: Demo,
});
export const Default = meta.story({});
