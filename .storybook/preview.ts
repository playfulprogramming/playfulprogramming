import addonA11y from "@storybook/addon-a11y";
import { definePreview } from "@storybook-astro/framework";

import "../src/global.scss";

export default definePreview({
	addons: [addonA11y()],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
});
