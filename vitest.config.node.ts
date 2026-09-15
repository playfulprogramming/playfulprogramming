import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^.*\.astro$/,
				replacement: fileURLToPath(
					new URL("./__mocks__/imports/astro-mock.ts", import.meta.url),
				),
			},
		],
	},
	test: {
		name: "node",
		include: ["**/*.node.spec.ts"],
		environment: "node",
	},
});
