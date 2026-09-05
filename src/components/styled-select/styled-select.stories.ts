import preview from "../../../.storybook/preview.ts";
import Demo, {
	type Props,
} from "../../../.storybook/fixtures/styled-select.astro";

// Keep option elements in an Astro fixture: the adapter sanitizes slot HTML.
const meta = preview.type<{ args: Props }>().meta({
	title: "Astro/StyledSelect",
	component: Demo,
	args: { "aria-label": "Framework" },
});
export const Default = meta.story({});
export const Disabled = meta.story({ args: { disabled: true } });
