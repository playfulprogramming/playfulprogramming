import { resolve } from "node:path";

import { defineConfig } from "@playwright/test";

const projectRoot = resolve(import.meta.dirname, "..");

export default defineConfig({
	testDir: import.meta.dirname,
	testMatch: "visual.spec.ts",
	fullyParallel: false,
	workers: 1,
	timeout: 120_000,
	updateSnapshots: "none",
	reporter: "list",
	outputDir: resolve(projectRoot, ".playwright/storybook-results"),
	webServer: {
		command: "pnpm storybook --ci --no-open",
		cwd: projectRoot,
		url: "http://127.0.0.1:6006/index.json",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		stdout: "pipe",
		stderr: "pipe",
	},
});
