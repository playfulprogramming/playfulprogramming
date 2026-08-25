import { randomUUID } from "node:crypto";
import {
	existsSync,
	globSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

import { expect, test } from "@playwright/test";

import {
	closeBrowsers,
	getScreenshots,
	runAddonImageDiff,
	type AddonScreenshotSetting,
} from "./playwright-config.ts";

interface StoryScreenshotFile {
	stories: Record<
		string,
		{
			screenshots?: AddonScreenshotSetting[];
		}
	>;
}

interface ScreenshotDefinition {
	filePath: string;
	setting: AddonScreenshotSetting;
	storyId: string;
}

function getScreenshotDefinitions(): ScreenshotDefinition[] {
	return globSync("src/**/*.stories.playwright.json").flatMap((filePath) => {
		const contents = JSON.parse(
			readFileSync(filePath, "utf8"),
		) as StoryScreenshotFile;

		return Object.entries(contents.stories).flatMap(([storyId, story]) =>
			(story.screenshots ?? []).map((setting) => ({
				filePath,
				setting,
				storyId,
			})),
		);
	});
}

function toKebabCase(value: string) {
	return value
		.replace(/([a-z\d])([A-Z])/g, "$1-$2")
		.replace(/[^a-z\d]+/gi, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();
}

function getBaselinePath({ filePath, setting, storyId }: ScreenshotDefinition) {
	const screenshotIdentifier = toKebabCase(
		`${storyId}--${setting.title}--${setting.browserType}`,
	);

	return join(
		dirname(filePath),
		"__screenshots__",
		`${screenshotIdentifier}.png`,
	);
}

test.afterAll(async () => {
	await closeBrowsers();
});

test("the Storybook manager loads the Playwright addon", async ({ page }) => {
	const pageErrors: string[] = [];
	page.on("pageerror", (error) => pageErrors.push(error.message));

	await page.goto("http://127.0.0.1:6006/");
	await expect(
		page.getByRole("tab", { name: "Playwright Actions" }),
	).toBeVisible();
	expect(pageErrors).toEqual([]);
});

test("the Storybook screenshots match their baselines", async ({}, testInfo) => {
	const requestId = randomUUID();

	if (testInfo.config.updateSnapshots === "all") {
		const definitions = getScreenshotDefinitions();
		const writtenBaselines = new Set<string>();

		const screenshots = await getScreenshots({
			requestId,
			requestType: "all",
			onScreenshotReady(buffer, { screenshotIdentifier, screenshotsDir }) {
				const baselinePath = join(
					screenshotsDir,
					`${screenshotIdentifier}.png`,
				);
				mkdirSync(dirname(baselinePath), { recursive: true });
				writeFileSync(baselinePath, buffer);
				writtenBaselines.add(relative(process.cwd(), baselinePath));
			},
		});

		expect(
			definitions.length,
			"No screenshots were found in the story Playwright definitions.",
		).toBeGreaterThan(0);
		expect(screenshots).toHaveLength(definitions.length);
		expect(writtenBaselines.size).toBe(screenshots.length);

		return;
	}

	const missingBaselines = getScreenshotDefinitions()
		.map(getBaselinePath)
		.filter((baselinePath) => !existsSync(baselinePath));

	expect(
		missingBaselines,
		"Screenshot baselines are missing. Run `pnpm test:storybook:update` and commit them.",
	).toEqual([]);

	const results = await runAddonImageDiff(requestId);

	expect(
		results.length,
		"No screenshots were found in the story Playwright definitions.",
	).toBeGreaterThan(0);

	const failures = results.filter(
		(result) => result.added || result.pass !== true,
	);
	const failureSummary = failures
		.map((result) => {
			const identity = [
				result.storyId,
				result.screenshotId,
				result.screenshotData?.browserType,
			]
				.filter(Boolean)
				.join(" / ");
			const reason = result.error
				? result.error
				: result.added
					? "baseline is missing"
					: `${result.diffPixelCount ?? "unknown"} pixels differ`;

			return `${identity}: ${reason}`;
		})
		.join("\n");

	expect(failures.length, failureSummary).toBe(0);
});
