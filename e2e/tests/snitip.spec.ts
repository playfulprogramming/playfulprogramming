import { expect, test, type Locator, type Page } from "@playwright/test";

async function getNodeSnitip(page: Page) {
	const trigger = page.locator('[data-snitip-trigger="nodejs"]').first();
	const button = trigger.getByRole("button", {
		name: "Node: Open tooltip for NodeJS",
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
	expect(
		await snitip.dialog.evaluate(
			(dialog) => getComputedStyle(dialog, "::backdrop").backgroundColor,
		),
	).toMatch(/(?:transparent|rgba\(0, 0, 0, 0\))/);

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

test.describe("snitip desktop hover dialog", () => {
	test.use({ viewport: { width: 1200, height: 800 } });

	test("shows the action hint for keyboard focus, not mouse hover", async ({
		page,
	}) => {
		await page.goto("/posts/example", { waitUntil: "networkidle" });
		const snitip = await getNodeSnitip(page);
		const hint = snitip.button.locator(".snitip-trigger__popup");
		const hintStyle = () =>
			hint.evaluate((element) => ({
				opacity: getComputedStyle(element).opacity,
				visibility: getComputedStyle(element).visibility,
			}));

		await snitip.button.hover();
		await expect.poll(hintStyle).toEqual({
			opacity: "0",
			visibility: "hidden",
		});
		await page.mouse.move(1, 1);

		await page.locator("body").press("Tab");
		await snitip.button.focus();
		expect(
			await snitip.button.evaluate((button) =>
				button.matches(":focus-visible"),
			),
		).toBe(true);
		await expect.poll(hintStyle).toEqual({
			opacity: "1",
			visibility: "visible",
		});

		await snitip.button.hover();
		await expect.poll(hintStyle).toEqual({
			opacity: "0",
			visibility: "hidden",
		});
		await expect(snitip.dialog).toBeVisible({ timeout: 1000 });
	});

	test("opens the same modal without a scrim and closes after pointer exit", async ({
		page,
	}) => {
		await page.goto("/posts/example", { waitUntil: "networkidle" });
		const snitip = await getNodeSnitip(page);

		await snitip.button.hover();
		await page.waitForTimeout(250);
		await expect(snitip.dialog).not.toBeVisible();
		await page.mouse.move(1, 1);
		await page.waitForTimeout(350);
		await expect(snitip.dialog).not.toBeVisible();

		await snitip.button.hover();
		await expect(snitip.dialog).toBeVisible({ timeout: 1000 });
		await expect(snitip.dialog).toHaveAttribute(
			"data-presentation",
			"anchored",
		);
		await expect(snitip.button).toHaveAttribute("aria-expanded", "true");
		await expect(snitip.dialog).toBeFocused();
		await expect(
			snitip.dialog.getByRole("button", { name: "Close" }),
		).not.toBeFocused();
		expect(
			await snitip.dialog
				.getByRole("button", { name: "Close" })
				.evaluate((button) => button.matches(":focus-visible")),
		).toBe(false);
		expect(
			await snitip.dialog.evaluate((dialog) => dialog.matches(":modal")),
		).toBe(true);
		expect(
			await snitip.dialog.evaluate(
				(dialog) => getComputedStyle(dialog, "::backdrop").backgroundColor,
			),
		).toMatch(/(?:transparent|rgba\(0, 0, 0, 0\))/);
		const triggerRect = await snitip.button.boundingBox();
		if (!triggerRect) throw new Error("NodeJS snitip trigger has no bounds");
		const triggerCenter = {
			x: triggerRect.x + triggerRect.width / 2,
			y: triggerRect.y + triggerRect.height / 2,
		};

		await page.mouse.click(triggerCenter.x, triggerCenter.y);
		await expect(snitip.dialog).toBeVisible();
		await expect(snitip.dialog).toHaveAttribute(
			"data-open-source",
			"activation",
		);
		await expect(
			snitip.dialog.getByRole("button", { name: "Close" }),
		).toBeFocused();
		await page.mouse.move(1, 1);
		await expect(snitip.dialog).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(snitip.dialog).not.toBeVisible();

		await snitip.button.hover();
		await expect(snitip.dialog).toBeVisible({ timeout: 1000 });
		await expect(snitip.dialog).toBeFocused();
		await expect(
			snitip.dialog.getByRole("button", { name: "Close" }),
		).not.toBeFocused();
		expect(
			await snitip.dialog
				.getByRole("button", { name: "Close" })
				.evaluate((button) => button.matches(":focus-visible")),
		).toBe(false);
		const dialogRect = await snitip.dialog.locator("form").boundingBox();
		if (!dialogRect) throw new Error("NodeJS snitip dialog has no bounds");
		const gapY =
			dialogRect.y > triggerRect.y
				? (triggerRect.y + triggerRect.height + dialogRect.y) / 2
				: (dialogRect.y + dialogRect.height + triggerRect.y) / 2;
		await page.mouse.move(triggerCenter.x, gapY);
		await expect(snitip.dialog).toBeVisible();
		await snitip.dialog.locator("form").hover();
		await expect(snitip.dialog).toBeVisible();
		await page.mouse.move(1, 1);
		await expect(snitip.dialog).not.toBeVisible();
		await expect(snitip.button).toHaveAttribute("aria-expanded", "false");
		await expect(snitip.button).not.toBeFocused();
		expect(
			await snitip.button.evaluate((button) =>
				button.matches(":focus-visible"),
			),
		).toBe(false);
		await expect
			.poll(() =>
				snitip.button
					.locator(".snitip-trigger__popup")
					.evaluate((element) => getComputedStyle(element).visibility),
			)
			.toBe("hidden");
	});

	test("cancels a pending hover when leaving the desktop breakpoint", async ({
		page,
	}) => {
		await page.goto("/posts/example", { waitUntil: "networkidle" });
		const snitip = await getNodeSnitip(page);

		await snitip.button.hover();
		await page.waitForTimeout(250);
		await page.setViewportSize({ width: 600, height: 800 });
		await page.waitForTimeout(350);
		await expect(snitip.dialog).not.toBeVisible();
		await expect(snitip.button).toHaveAttribute("aria-expanded", "false");
	});

	test("opens persistently from a direct mouse click", async ({ page }) => {
		await page.goto("/posts/example", { waitUntil: "networkidle" });
		const snitip = await getNodeSnitip(page);

		await snitip.button.click();
		await expect(snitip.dialog).toBeVisible();
		await page.mouse.move(1, 1);
		await expect(snitip.dialog).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(snitip.dialog).not.toBeVisible();
		await expect(snitip.button).toBeFocused();
	});

	test("does not open from hover while a mouse activation is in progress", async ({
		page,
	}) => {
		await page.goto("/posts/example", { waitUntil: "networkidle" });
		const snitip = await getNodeSnitip(page);
		const triggerRect = await snitip.button.boundingBox();
		if (!triggerRect) throw new Error("NodeJS snitip trigger has no bounds");

		await page.mouse.move(
			triggerRect.x + triggerRect.width / 2,
			triggerRect.y + triggerRect.height / 2,
		);
		await page.waitForTimeout(400);
		await page.mouse.down();
		await page.waitForTimeout(200);
		await expect(snitip.dialog).not.toBeVisible();
		await page.mouse.up();
		await expect(snitip.dialog).not.toBeVisible();
	});
});

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
			await page.mouse.move(1, 1);
			await expect(snitip.dialog).toBeVisible();
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
