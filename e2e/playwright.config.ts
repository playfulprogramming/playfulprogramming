import { defineConfig, devices } from "@playwright/test";

const defaultBaseURL = "http://localhost:4321";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? defaultBaseURL;
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "true";
const resultsDir =
	process.env.PLAYWRIGHT_RESULTS_DIR ?? ".playwright/test-results";
const reportDir = process.env.PLAYWRIGHT_REPORT_DIR ?? ".playwright/report";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [["html", { outputFolder: reportDir, open: "never" }]],
	outputDir: resultsDir,
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('')`. */
		baseURL,

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		/* CI=1 tells astro.config.ts to turn off the dev toolbar */
		/* USE_E2E_MOCKS=1 imports e2e/setup.ts, which mocks external services using MSW */
		command: "CI=1 USE_E2E_MOCKS=1 pnpm dev --port 8889",
		url: "http://localhost:8889",
		timeout: 120_000,
		reuseExistingServer: false,
	},
});
