import { test, expect } from "@playwright/test";

const MAX_DIFF_PIXELS = 150;

test("posts/example renders light mode", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixels: MAX_DIFF_PIXELS,
	});
});

test("posts/example renders dark mode", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	await page.click('button[data-theme-toggle="true"]');

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixels: MAX_DIFF_PIXELS,
	});
});
