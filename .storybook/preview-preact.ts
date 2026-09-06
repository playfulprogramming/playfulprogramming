import { definePreview } from "storybook/internal/csf";
import type { PreactRenderer } from "@storybook/preact";
import {
	render,
	renderToCanvas,
	parameters,
} from "@storybook/preact/entry-preview";
import addonA11y from "@storybook/addon-a11y";
import "../src/styles/global.scss";

// Preact's renderer does not yet export a CSF Next factory. Compose its
// official rendering annotations so these stories retain client-side state.
export default definePreview<PreactRenderer, [ReturnType<typeof addonA11y>]>({
	render,
	renderToCanvas,
	parameters: { ...parameters, layout: "padded" },
	addons: [addonA11y()],
});
