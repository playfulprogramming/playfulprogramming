import addonA11y from "@storybook/addon-a11y";
import { definePreview } from "@storybook-astro/framework";

import "../src/styles/global.scss";
import "./astro-styles.ts";

export default definePreview({
	addons: [addonA11y()],
	beforeAll: async () => {
		// React Aria captures HTMLElement.prototype.focus during initialization.
		// Load it before Storybook installs its focus getter in the story loaders;
		// otherwise navigating to the first React Aria story throws Illegal invocation.
		await import("react-aria");
	},
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
});

export { default as preactPreview } from "./preview-preact.ts";
