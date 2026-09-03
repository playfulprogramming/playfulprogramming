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

	await page
		.getByRole("button", { name: "Customize theme", exact: true })
		.click();
	const themeDialog = page.locator("[data-theme-sidebar]");
	await themeDialog.locator('label[for="theme-mode-dark"]').click();
	await themeDialog
		.getByRole("button", { name: "Save changes", exact: true })
		.click();
	await expect(page.locator("html")).toHaveClass(/\bdark\b/);

	await expect(page).toHaveScreenshot({
		fullPage: true,
		maxDiffPixels: MAX_DIFF_PIXELS,
	});
});

test("posts/example fragment links resolve", async ({ page }) => {
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	const unresolvedFragments = await page
		.getByTestId("post-body-div")
		.locator('a[href^="#"]')
		.evaluateAll((links) =>
			links.flatMap((link) => {
				const href = link.getAttribute("href");
				if (!href || href === "#") return [];

				const fragment = href.slice(1);
				let decodedFragment = fragment;
				try {
					decodedFragment = decodeURIComponent(fragment);
				} catch {
					// A malformed escape cannot match a decoded ID.
				}

				return document.getElementById(fragment) ||
					document.getElementById(decodedFragment)
					? []
					: [href];
			}),
		);

	expect(unresolvedFragments).toEqual([]);
	await expect(page.locator("#why-does-js")).toHaveText(
		"Based on what you’ve seen: Why does JS?",
	);
	await expect(page.locator("#why-does-js")).toBeVisible();
	await expect(page.getByRole("radiogroup").first()).toHaveAccessibleName(
		"Based on what you’ve seen: Why does JS?",
	);
});
