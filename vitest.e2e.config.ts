import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { BASE_EXCLUDES } from "./vitest-constants";

const VIEWPORT = { width: 1280, height: 720 };

export default defineConfig({
	plugins: [],
	test: {
		include: ["./e2e-tests/**/*.spec.ts"],
		exclude: [...BASE_EXCLUDES],
		browser: {
			enabled: true,
			provider: playwright(),
			// https://vitest.dev/config/browser/playwright
			instances: ["chromium", "firefox", "webkit"].map((browser) => ({
				browser,
				viewport: VIEWPORT,
			})),
		},
		testTimeout: 120_000,
	},
});
