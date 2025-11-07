import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import preact from "@preact/preset-vite";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
	plugins: [tsconfigPaths(), preact()],
	test: {
		globals: true,
		exclude: [
			"**/content/**",
			"**/node_modules/**",
			"**/dist/**",
			"**/cypress/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
			"**/!*.browser.spec.ts",
			"**/!*.browser.spec.tsx",
		],
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: "chromium" }],
		},
		include: [
			"**/*.browser.spec.ts",
			"**/*.browser.spec.tsx",
		]
	},
	resolve: {
		alias: {
			react: "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat", // Must be below test-utils
			"react/jsx-runtime": "preact/jsx-runtime",
		},
	},
});
