import { expect, test, type Locator, type Page } from "@playwright/test";

let embed: Locator;

test.beforeEach(async ({ page }) => {
	await page.goto("/posts/ffg-fundamentals-intro-to-components", {
		waitUntil: "networkidle",
	});
	embed = page.locator("astro-island[component-export='CodeEmbed']").first();
	await embed.scrollIntoViewIfNeeded();
});

async function selectFile(page: Page, current: string, next: string) {
	await embed.getByRole("button", { name: current }).first().click();
	await page
		.locator("dialog[open]")
		.getByRole("button", { name: next, exact: true })
		.click();
}

test("code embed shows the default file and loads others on demand", async ({
	page,
}) => {
	const code = embed.locator("pre.shiki").first();
	await expect(code).toContainText("createRoot");

	await selectFile(page, "src/main.jsx", "package.json");
	await expect(code).toContainText(
		'"name": "@ffg-fundamentals/react-rendering-1"',
	);

	await selectFile(page, "package.json", "index.html");
	await expect(code).toContainText("React Rendering - Example #1");
});
