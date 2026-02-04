import { test, expect, type Page } from "@playwright/test";

const MAX_DIFF_PIXELS = 150;

async function forceLoadLazyImages(page: Page): Promise<void> {
	await page.evaluate(() => {
		for (const image of Array.from(
			document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'),
		)) {
			image.setAttribute("loading", "eager"); // Force eager loading
			image.setAttribute("decoding", "sync"); // Force eager loading
			image.loading = "eager";
			image.decoding = "sync";
			const src = image.src;
			image.src = ""; // Reset src to reload the image
			image.src = src; // Set src back to original
		}
	});

	await page.waitForLoadState("networkidle");
}

test("posts/example renders light mode", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	await forceLoadLazyImages(page);

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixels: MAX_DIFF_PIXELS,
	});
});

test("posts/example renders dark mode", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	await forceLoadLazyImages(page);

	await page.click('button[data-theme-toggle="true"]');

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixels: MAX_DIFF_PIXELS,
	});
});
