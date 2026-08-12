import { expect, test, type Locator, type Page } from "@playwright/test";

async function getNodeSnitip(page: Page) {
	const trigger = page.locator('[data-snitip-trigger="nodejs"]').first();
	const button = trigger.getByRole("button", {
		name: 'Open tooltip for "NodeJS"',
		exact: true,
	});
	const dialogId = await trigger.getAttribute("data-snitip-dialog");
	if (!dialogId) throw new Error("NodeJS snitip is missing its dialog id");

	return {
		button,
		dialog: page.locator(`[id="${dialogId}"]`),
		dialogId,
	};
}

async function openNodeSnitip(page: Page) {
	const snitip = await getNodeSnitip(page);
	await expect(snitip.button).toHaveAttribute("aria-controls", snitip.dialogId);
	await expect(snitip.button).toHaveAttribute("aria-expanded", "false");
	await expect(snitip.button).toHaveAttribute("aria-haspopup", "dialog");

	await snitip.button.focus();
	await snitip.button.press("Enter");

	await expect(snitip.dialog).toBeVisible();
	await expect(snitip.dialog).toHaveAccessibleName("Tooltip: NodeJS");
	await expect(snitip.button).toHaveAttribute("aria-expanded", "true");
	await expect(
		snitip.dialog.getByRole("button", { name: "Close" }),
	).toBeFocused();
	expect(
		await snitip.dialog.evaluate((dialog) => dialog.matches(":modal")),
	).toBe(true);

	return snitip;
}

async function expectFocusContained(page: Page, dialog: Locator) {
	const focusableCount = await dialog.locator("button, a[href]").count();
	for (let i = 0; i <= focusableCount; i++) {
		await page.keyboard.press("Tab");
		expect(
			await dialog.evaluate((element) =>
				element.contains(document.activeElement),
			),
		).toBe(true);
	}

	await page.keyboard.press("Shift+Tab");
	expect(
		await dialog.evaluate((element) =>
			element.contains(document.activeElement),
		),
	).toBe(true);
}

for (const testCase of [
	{ name: "anchored desktop", width: 1200, presentation: "anchored" },
	{ name: "centered mobile", width: 600, presentation: "centered" },
]) {
	test.describe(`snitip ${testCase.name} dialog`, () => {
		test.use({ viewport: { width: testCase.width, height: 800 } });

		test("announces state, contains focus, and restores the invoker", async ({
			page,
		}) => {
			await page.goto("/posts/example", { waitUntil: "networkidle" });

			const snitip = await openNodeSnitip(page);
			await expect(snitip.dialog).toHaveAttribute(
				"data-presentation",
				testCase.presentation,
			);
			await expectFocusContained(page, snitip.dialog);

			await page.keyboard.press("Escape");
			await expect(snitip.dialog).not.toBeVisible();
			await expect(snitip.button).toHaveAttribute("aria-expanded", "false");
			await expect(snitip.button).toBeFocused();

			await snitip.button.press("Space");
			await expect(snitip.dialog).toBeVisible();
			await expect(snitip.button).toHaveAttribute("aria-expanded", "true");
			await expect(
				snitip.dialog.getByRole("button", { name: "Close" }),
			).toBeFocused();
			await snitip.dialog.getByRole("button", { name: "Close" }).press("Enter");
			await expect(snitip.dialog).not.toBeVisible();
			await expect(snitip.button).toHaveAttribute("aria-expanded", "false");
			await expect(snitip.button).toBeFocused();

			await snitip.button.press("Enter");
			await expect(snitip.dialog).toBeVisible();
			await page.mouse.click(1, 1);
			await expect(snitip.dialog).not.toBeVisible();
			await expect(snitip.button).toHaveAttribute("aria-expanded", "false");
			await expect(snitip.button).toBeFocused();
		});
	});
}

test("keeps an open dialog modal when crossing the responsive breakpoint", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1200, height: 800 });
	await page.goto("/posts/example", { waitUntil: "networkidle" });

	const snitip = await openNodeSnitip(page);
	await expect(snitip.dialog).toHaveAttribute("data-presentation", "anchored");

	await page.setViewportSize({ width: 600, height: 800 });
	await expect(snitip.dialog).toHaveAttribute("data-presentation", "centered");
	expect(
		await snitip.dialog.evaluate((dialog) => dialog.matches(":modal")),
	).toBe(true);
	await expect(snitip.button).toHaveAttribute("aria-expanded", "true");

	await page.setViewportSize({ width: 1200, height: 800 });
	await expect(snitip.dialog).toHaveAttribute("data-presentation", "anchored");
	expect(
		await snitip.dialog.evaluate((dialog) => dialog.matches(":modal")),
	).toBe(true);
	await expect
		.poll(() =>
			snitip.dialog.evaluate(
				(dialog) => Boolean(dialog.style.left) && Boolean(dialog.style.top),
			),
		)
		.toBe(true);
	await expect(snitip.button).toHaveAttribute("aria-expanded", "true");

	await page.keyboard.press("Escape");
	await expect(snitip.button).toHaveAttribute("aria-expanded", "false");
	await expect(snitip.button).toBeFocused();
});
