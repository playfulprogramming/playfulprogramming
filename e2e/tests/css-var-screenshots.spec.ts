/**
 * Visual regression baselines for undefined or mismatched CSS custom properties
 * see analogous TODO(undefined-css-vars) / TODO(unused-css-vars) comments in files
 */
import { test, expect, type Page } from "@playwright/test";

type ColorScheme = "light" | "dark";

const themes: ColorScheme[] = ["light", "dark"];

async function goTo(page: Page, path: string, colorScheme: ColorScheme) {
	await page.emulateMedia({ colorScheme });
	await page.goto(path, { waitUntil: "networkidle" });
}

for (const theme of themes) {
	// TODO(unused-css-vars): --hint-container_gap
	test(`hint gap spacing (${theme})`, async ({ page }) => {
		await goTo(page, "/posts/css-specificity-explained", theme);
		const hint = page.locator("details").first();
		await hint.waitFor({ state: "visible" });
		await expect(hint).toHaveScreenshot(`hint-gap-${theme}.png`);
	});

	// TODO(undefined-css-vars): found --search-page_filter_list_controls_label, code expects --search-page_filter_list_controls_label-color
	test(`select filter label color (${theme})`, async ({ page }) => {
		await goTo(page, "/search", theme);
		const label = page.locator("[class*=visibleLabel]").first();
		await label.waitFor({ state: "visible" });
		await expect(label).toHaveScreenshot(`select-label-color-${theme}.png`);
	});

	// TODO(undefined-css-vars): found --resizeable-panel_separator_border_width_focused, code expects --resizeable-panel_separator_outline_width_focused
	test(`resizeable panel separator (${theme})`, async ({ page }) => {
		await goTo(page, "/posts/ffg-fundamentals-dynamic-html", theme);
		const separator = page.locator('[role="separator"]').first();
		await separator.waitFor({ state: "visible" });
		await expect(separator).toHaveScreenshot(
			`resizeable-separator-${theme}.png`,
		);
	});

	// TODO(undefined-css-vars): found --resizeable-panel_separator_border_width_focused, code expects --resizeable-panel_separator_outline_width_focused
	test(`resizeable panel separator focused (${theme})`, async ({ page }) => {
		await goTo(page, "/posts/ffg-fundamentals-dynamic-html", theme);
		const separator = page.locator('[role="separator"]').first();
		await separator.waitFor({ state: "visible" });
		await separator.focus();
		await expect(separator).toHaveScreenshot(
			`resizeable-separator-focused-${theme}.png`,
		);
	});

	// TODO(undefined-css-vars): found --filesystem_item_folder_focus-background_color, code expects --filesystem_item_folder_container_color_focused
	test(`file list folder focus background (${theme})`, async ({ page }) => {
		await goTo(
			page,
			"/posts/sharing-python-modules-across-microservices",
			theme,
		);
		const summary = page.locator("[class*=directorySummary]").first();
		await summary.waitFor({ state: "visible" });
		await summary.focus();
		await expect(summary).toHaveScreenshot(
			`file-list-folder-focus-${theme}.png`,
		);
	});

	// TODO(undefined-css-vars): --link-color ambiguous, --primary_default or --foreground_* could fit
	test(`post author color (${theme})`, async ({ page }) => {
		await goTo(page, "/posts/css-specificity-explained", theme);
		const authors = page.locator("ul[aria-label='Post authors']");
		await authors.waitFor({ state: "visible" });
		await expect(authors).toHaveScreenshot(`post-author-color-${theme}.png`);
	});

	// TODO(undefined-css-vars): --primary ambiguous, --primary_default or --primary_variant could fit
	test(`toc arrow color (${theme})`, async ({ page }) => {
		await goTo(page, "/posts/css-specificity-explained", theme);
		// desktop toc
		const toc = page.locator(
			"aside[aria-labelledby='table-of-contents-heading']:not(#mobile-table-of-contents)",
		);
		await toc.waitFor({ state: "visible" });
		await expect(toc).toHaveScreenshot(`toc-arrow-color-${theme}.png`);
	});

	// TODO(undefined-css-vars): found --on-dark-emphasis_high, code expects --on-dark-emphasis-high
	test(`ffg quotes text color (${theme})`, async ({ page }) => {
		await goTo(page, "/collections/framework-field-guide", theme);
		const quotes = page.locator("[class*=fullQuotesContainer]").first();
		await quotes.waitFor({ state: "visible" });
		await expect(quotes).toHaveScreenshot(`ffg-quotes-text-${theme}.png`);
	});

	// TODO(undefined-css-vars): found --outline-focused, code expects --outline_focused
	test(`ffg signup email focus border (${theme})`, async ({ page }) => {
		await goTo(page, "/collections/framework-field-guide", theme);
		const email = page.locator("[class*=emailInput]").first();
		await email.waitFor({ state: "visible" });
		await email.focus();
		await expect(email).toHaveScreenshot(`ffg-signup-email-focus-${theme}.png`);
	});
}
