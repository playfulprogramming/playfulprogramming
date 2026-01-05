import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { playwright } from "@vitest/browser-playwright";
import preact from "@preact/preset-vite";
import path from "path";

export default defineConfig({
	plugins: [tsconfigPaths(), preact()],
	test: {
		setupFiles: ["__mocks__/setup.ts"],
		browser: {
			enabled: true,
			provider: playwright(),
			// https://vitest.dev/config/browser/playwright
			instances: [{ browser: "firefox" }],
		},
		exclude: [
			"**/content/**",
			"**/node_modules/**",
			"**/dist/**",
			"**/cypress/**",
			"**/e2e-tests/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
		],
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, "src"),
			react: "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat", // Must be below test-utils
			"react/jsx-runtime": "preact/jsx-runtime",
		},
	},
});
