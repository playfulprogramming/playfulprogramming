// import { chromium } from "@playwright/test";
import { test, expect } from "vitest";
import { page } from "vitest/browser";

test("hi", async () => {
	// assumes you ran the dev server already since didn't
	// setup any dev server life cycle stuffs yet
	// to match playwright, you will also need to run the script 3 times to test all browsers
	const res = await fetch("http://localhost:4326/posts/example");
	const html = await res.text();

	render(html);

	{
		const bodyHeight = document.documentElement.scrollHeight;
		const bodyWidth = document.documentElement.scrollWidth;
		await page.viewport(bodyWidth, bodyHeight);
	}

	expect(document.body.querySelector("h1")?.textContent.trim()).toBe(
		"Example Post",
	);
	await expect(document.body).toMatchScreenshot({
		screenshotOptions: { fullPage: true, quality: 100 },
	});

	// document.location.href =
	// 	"https://www.epicweb.dev/vitest-browser-mode-vs-playwright";

	// const browser = await chromium.launch()
	// const page = await browser.newPage();
	// await page.goto("https://www.epicweb.dev/vitest-browser-mode-vs-playwright");

	// await expect(page.()).toMatchScreenshot({
	// 	screenshotOptions: { fullPage: true },
	// });

	// await browser.close();
});

function render(htmlString: string) {
	const newDoc = new DOMParser().parseFromString(htmlString, "text/html");

	document.head.replaceWith(newDoc.head.cloneNode(true));
	document.body.replaceWith(newDoc.body.cloneNode(true));
	console.log(newDoc.body.querySelector("h1"));
	console.log(document.body.querySelector("h1"));
}

// test("posts/example renders light mode", async ({ page }) => {
// 	await page.goto("/posts/example");

// 	await expect(page).toHaveScreenshot({ fullPage: true });
// });

// test("posts/example renders dark mode", async ({ page }) => {
// 	await page.goto("/posts/example");

// 	await page.click('button[data-theme-toggle="true"]');

// 	await expect(page).toHaveScreenshot({ fullPage: true });
// });
