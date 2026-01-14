import { test, expect } from "@playwright/test";

test("posts/example renders light mode", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixels: 100 });
});

test("posts/example renders dark mode", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	await page.click('button[data-theme-toggle="true"]');

	await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixels: 100 });
});
