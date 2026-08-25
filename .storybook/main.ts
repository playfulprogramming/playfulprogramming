import { delimiter, resolve } from "node:path";

import { preact } from "@storybook-astro/framework/integrations";
import { defineMain } from "@storybook-astro/framework/node";

const projectRoot = resolve(import.meta.dirname, "..");

// Storybook Astro's isolated static-prerender Vite server does not inherit the
// project's Vite aliases. Sass honors SASS_PATH in both that server and the
// regular preview build, preserving the site's `@use "src/..."` imports.
process.env.SASS_PATH = process.env.SASS_PATH
	? `${projectRoot}${delimiter}${process.env.SASS_PATH}`
	: projectRoot;

export default defineMain({
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-a11y"],
	framework: {
		name: "@storybook-astro/framework",
		options: {
			integrations: [preact({ compat: true })],
		},
	},
	staticDirs: ["../public"],
	viteFinal(config) {
		config.resolve ??= {};

		const srcPath = resolve(projectRoot, "src");
		config.resolve.alias = Array.isArray(config.resolve.alias)
			? [...config.resolve.alias, { find: "src", replacement: srcPath }]
			: { ...config.resolve.alias, src: srcPath };

		return config;
	},
});
