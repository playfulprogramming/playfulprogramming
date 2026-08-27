import { test, expect, type Page } from "@playwright/test";

const MAX_DIFF_PIXELS = 150;

async function forceLoadLazyImages(page: Page): Promise<void> {
	await page.evaluate(async () => {
		const promises: Promise<unknown>[] = [];
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
			const { promise, resolve, reject } = Promise.withResolvers();
			image.onload = resolve;
			image.onerror = reject;
			promises.push(promise);
		}
		await Promise.all(promises);
	});

	await page.waitForLoadState("networkidle");
}

async function waitForMermaidDiagrams(page: Page): Promise<void> {
	const diagrams = page.locator("pre.mermaid");
	const diagramCount = await diagrams.count();
	expect(diagramCount).toBeGreaterThan(0);
	await expect(page.locator("pre.mermaid > svg")).toHaveCount(diagramCount);
}

test("posts/example renders light mode", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	await forceLoadLazyImages(page);
	await waitForMermaidDiagrams(page);

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixels: MAX_DIFF_PIXELS,
	});
});

test("posts/example renders dark mode", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	await forceLoadLazyImages(page);
	await waitForMermaidDiagrams(page);

	await page.click('button[data-theme-toggle="true"]');
	await expect(page.locator("html")).toHaveClass("dark");

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixels: MAX_DIFF_PIXELS,
	});
});
