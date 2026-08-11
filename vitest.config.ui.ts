import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import preact from "@preact/preset-vite";
import path from "path";

export default defineConfig({
	plugins: [preact()],
	test: {
		name: "ui",
		include: ["**/*.ui.spec.{ts,tsx}"],
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: "firefox" }],
		},
		setupFiles: ["__mocks__/setup.ts"],
	},
	resolve: {
		tsconfigPaths: true,
		alias: {
			src: path.resolve(__dirname, "src"),
			react: "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat",
			"react/jsx-runtime": "preact/jsx-runtime",
		},
	},
});
