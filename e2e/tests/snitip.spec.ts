import { expect, test, type Locator, type Page } from "@playwright/test";

async function getNodeSnitip(page: Page) {
	const trigger = page.locator('[data-snitip-trigger="nodejs"]').first();
	const dialogId = await trigger.getAttribute("data-snitip-dialog");
	if (!dialogId) throw new Error("NodeJS snitip is missing its dialog id");
	const dialog = page.locator(`[id="${dialogId}"]`);

	return {
		button: trigger.getByRole("button", {
			name: "Node: Open tooltip for NodeJS",
			exact: true,
		}),
		dialog,
		dialogId,
		title: dialog.locator("[data-snitip-title]"),
	};
}

async function loadNodeSnitip(page: Page) {
	await page.goto("/posts/example", { waitUntil: "networkidle" });
	return getNodeSnitip(page);
}

async function openNodeSnitip(page: Page, key = "Enter") {
	const snitip = await loadNodeSnitip(page);
	await snitip.title.evaluate((title) => {
		title.addEventListener(
			"focus",
			() => {
				const dialog = title.closest("dialog");
				const trigger = dialog?.id
					? document.querySelector<HTMLElement>(
							`[aria-controls="${dialog.id}"]`,
						)
					: null;
				title.dataset.triggerExpandedWhenFocused =
					trigger?.getAttribute("aria-expanded") ?? "missing";
			},
			{ once: true },
		);
	});
	await snitip.button.focus();
	await snitip.button.press(key);
	await expect(snitip.dialog).toBeVisible();
	return snitip;
}

async function expectTransparentBackdrop(dialog: Locator) {
	expect(
		await dialog.evaluate(
			(element) => getComputedStyle(element, "::backdrop").backgroundColor,
		),
	).toMatch(/(?:transparent|rgba\(0, 0, 0, 0\))/);
}

async function expectBackdropColor(dialog: Locator, color: string) {
	await expect
		.poll(() =>
			dialog.evaluate(
				(element) => getComputedStyle(element, "::backdrop").backgroundColor,
			),
		)
		.toBe(color);
}

async function hasVisibleFocusOutline(element: Locator) {
	return element.evaluate((focusedElement) => {
		const style = getComputedStyle(focusedElement);
		return (
			style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0
		);
	});
}

async function expectClosed(button: Locator, dialog: Locator) {
	await expect(dialog).not.toBeVisible();
	await expect(button).toHaveAttribute("aria-expanded", "false");
	await expect(button).toBeFocused();
}

test.describe("snitip desktop hover dialog", () => {
	test.use({ viewport: { width: 1200, height: 800 } });

	test("shows its action hint only for keyboard focus", async ({ page }) => {
		const { button } = await loadNodeSnitip(page);
		const hint = button.locator(".snitip-trigger__popup");
		const hintStyle = () =>
			hint.evaluate((element) => ({
				opacity: getComputedStyle(element).opacity,
				visibility: getComputedStyle(element).visibility,
			}));

		await button.hover();
		await expect.poll(hintStyle).toEqual({
			opacity: "0",
			visibility: "hidden",
		});
		await page.mouse.move(1, 1);
		await page.locator("body").press("Tab");
		await button.focus();
		expect(await button.evaluate((el) => el.matches(":focus-visible"))).toBe(
			true,
		);
		await expect.poll(hintStyle).toEqual({
			opacity: "1",
			visibility: "visible",
		});

		await button.hover();
		await expect.poll(hintStyle).toEqual({
			opacity: "0",
			visibility: "hidden",
		});
	});

	test("opens on hover and closes without synthesizing trigger focus", async ({
		page,
	}) => {
		const snitip = await loadNodeSnitip(page);
		const close = snitip.dialog.getByRole("button", {
			name: "Close tooltip",
		});

		await snitip.button.hover();
		await page.waitForTimeout(250);
		await expect(snitip.dialog).not.toBeVisible();
		await page.mouse.move(1, 1);
		await page.waitForTimeout(350);
		await expect(snitip.dialog).not.toBeVisible();

		await snitip.button.hover();
		await expect(snitip.dialog).toBeVisible({ timeout: 1000 });
		await expect
			.poll(() =>
				snitip.dialog.evaluate((el) => Boolean(el.style.left && el.style.top)),
			)
			.toBe(true);
		await expect(snitip.button).toHaveAttribute("aria-expanded", "true");
		expect(await snitip.dialog.evaluate((el) => el.matches(":modal"))).toBe(
			true,
		);
		await expect(snitip.title).toBeFocused();
		expect(await hasVisibleFocusOutline(snitip.title)).toBe(false);
		await expect(close).not.toBeFocused();
		expect(await close.evaluate((el) => el.matches(":focus-visible"))).toBe(
			false,
		);
		await expectTransparentBackdrop(snitip.dialog);

		const triggerRect = await snitip.button.boundingBox();
		if (!triggerRect) throw new Error("NodeJS snitip trigger has no bounds");
		const triggerCenter = {
			x: triggerRect.x + triggerRect.width / 2,
			y: triggerRect.y + triggerRect.height / 2,
		};
		const dialogRect = await snitip.dialog.locator("form").boundingBox();
		if (!dialogRect) throw new Error("NodeJS snitip dialog has no bounds");
		const gapY =
			dialogRect.y > triggerRect.y
				? (triggerRect.y + triggerRect.height + dialogRect.y) / 2
				: (dialogRect.y + dialogRect.height + triggerRect.y) / 2;
		await page.mouse.move(triggerCenter.x, gapY);
		await snitip.dialog.locator("form").hover();
		await expect(snitip.dialog).toBeVisible();
		await page.mouse.move(1, 1);
		await expect(snitip.dialog).not.toBeVisible();
		await expect(snitip.button).toHaveAttribute("aria-expanded", "false");
		await expect(snitip.button).not.toBeFocused();
		expect(
			await snitip.button.evaluate((el) => el.matches(":focus-visible")),
		).toBe(false);

		await snitip.button.focus();
		await snitip.button.hover();
		await expect(snitip.dialog).toBeVisible({ timeout: 1000 });
		await page.mouse.move(1, 1);
		await expectClosed(snitip.button, snitip.dialog);
	});

	test("announces keyboard exit from a hovered dialog and supports pinning", async ({
		page,
	}) => {
		const snitip = await loadNodeSnitip(page);
		await snitip.button.hover();
		await expect(snitip.dialog).toBeVisible({ timeout: 1000 });
		await expect(snitip.title).toBeFocused();

		await page.keyboard.press("Escape");
		await expectClosed(snitip.button, snitip.dialog);

		await page.mouse.move(1, 1);
		await snitip.button.hover();
		await expect(snitip.dialog).toBeVisible({ timeout: 1000 });
		await page.keyboard.press("Tab");
		await page.keyboard.press("Escape");
		await expectClosed(snitip.button, snitip.dialog);

		await page.mouse.move(1, 1);
		await snitip.button.hover();
		await expect(snitip.dialog).toBeVisible({ timeout: 1000 });
		const triggerRect = await snitip.button.boundingBox();
		if (!triggerRect) throw new Error("NodeJS snitip trigger has no bounds");
		await page.mouse.click(
			triggerRect.x + triggerRect.width / 2,
			triggerRect.y + triggerRect.height / 2,
		);
		await expect(snitip.title).toBeFocused();
		await page.mouse.move(1, 1);
		await expect(snitip.dialog).toBeVisible();
		await page.keyboard.press("Escape");
		await expectClosed(snitip.button, snitip.dialog);
	});

	test("cancels pending hover across breakpoints and mouse activation", async ({
		page,
	}) => {
		let snitip = await loadNodeSnitip(page);
		await snitip.button.hover();
		await page.waitForTimeout(250);
		await page.setViewportSize({ width: 600, height: 800 });
		await page.waitForTimeout(350);
		await expect(snitip.dialog).not.toBeVisible();

		await page.setViewportSize({ width: 1200, height: 800 });
		snitip = await loadNodeSnitip(page);
		const rect = await snitip.button.boundingBox();
		if (!rect) throw new Error("NodeJS snitip trigger has no bounds");
		await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
		await page.waitForTimeout(400);
		await page.mouse.down();
		await page.waitForTimeout(200);
		await expect(snitip.dialog).not.toBeVisible();
		await page.mouse.up();
		await page.reload({ waitUntil: "networkidle" });
		snitip = await getNodeSnitip(page);
		await snitip.button.click();
		await expect(snitip.dialog).toBeVisible();
		await page.mouse.move(1, 1);
		await expect(snitip.dialog).toBeVisible();
		await page.keyboard.press("Escape");
		await expectClosed(snitip.button, snitip.dialog);
	});
});

for (const { name, width, anchored } of [
	{ name: "anchored desktop", width: 1400, anchored: true },
	{ name: "centered mobile", width: 600, anchored: false },
]) {
	test(`snitip ${name} is an accessible modal`, async ({ page }) => {
		await page.setViewportSize({ width, height: 800 });
		const snitip = await openNodeSnitip(page);
		const close = snitip.dialog.getByRole("button", {
			name: "Close tooltip",
		});

		await expect(snitip.button).toHaveAttribute(
			"aria-controls",
			snitip.dialogId,
		);
		await expect(snitip.button).toHaveAttribute("aria-haspopup", "dialog");
		await expect(snitip.button).toHaveAttribute("aria-expanded", "true");
		await expect(snitip.dialog).toHaveAttribute("aria-modal", "true");
		expect(
			await snitip.dialog.evaluate(
				(dialog) => dialog.parentElement === document.body,
			),
		).toBe(true);
		expect(
			await snitip.dialog.evaluate(
				(dialog) =>
					dialog.closest('[aria-labelledby="blog-post-contents"]') === null,
			),
		).toBe(true);
		const titleId = await snitip.title.getAttribute("id");
		if (!titleId) throw new Error("NodeJS snitip title is missing its id");
		await expect(snitip.dialog).toHaveAttribute("aria-labelledby", titleId);
		await expect(snitip.dialog).toHaveAccessibleName("Tooltip: NodeJS");
		await expect(snitip.title).toHaveAttribute(
			"data-trigger-expanded-when-focused",
			"true",
		);
		await expect
			.poll(() =>
				snitip.dialog.evaluate((el) => Boolean(el.style.left && el.style.top)),
			)
			.toBe(anchored);
		expect(await snitip.dialog.evaluate((el) => el.matches(":modal"))).toBe(
			true,
		);
		if (anchored) {
			await expectTransparentBackdrop(snitip.dialog);
		} else {
			await page.evaluate(() =>
				document.documentElement.classList.remove("dark"),
			);
			await expectBackdropColor(snitip.dialog, "rgba(0, 0, 0, 0.32)");
			await page.evaluate(() => document.documentElement.classList.add("dark"));
			await expectBackdropColor(snitip.dialog, "rgba(0, 0, 0, 0.72)");
			await page.evaluate(() =>
				document.documentElement.classList.remove("dark"),
			);
		}
		await expect(snitip.dialog.locator("p").first()).toHaveCSS(
			"font-size",
			"16px",
		);
		await expect(snitip.title).toBeFocused();
		expect(await hasVisibleFocusOutline(snitip.title)).toBe(true);
		await page.keyboard.press("Shift+Tab");
		await expect(close).toBeFocused();
		await page.keyboard.press("Tab");
		expect(
			await snitip.dialog.evaluate((el) => el.contains(document.activeElement)),
		).toBe(true);
		await page.keyboard.press("Shift+Tab");
		await expect(close).toBeFocused();

		await snitip.button.evaluate((button) => {
			button.addEventListener(
				"focus",
				() => {
					button.dataset.expandedWhenFocused =
						button.getAttribute("aria-expanded") ?? "missing";
				},
				{ once: true },
			);
		});
		await page.keyboard.press("Escape");
		await expectClosed(snitip.button, snitip.dialog);
		await expect(snitip.button).toHaveAttribute(
			"data-expanded-when-focused",
			"false",
		);
		await snitip.button.press("Space");
		await expect(snitip.title).toBeFocused();
		expect(await hasVisibleFocusOutline(snitip.title)).toBe(true);
		await close.focus();
		await close.press("Enter");
		await expectClosed(snitip.button, snitip.dialog);
		await snitip.button.press("Enter");
		await expect(snitip.title).toBeFocused();
		await page.mouse.click(1, 1);
		await expectClosed(snitip.button, snitip.dialog);
	});
}

test("keeps an open modal across responsive presentations", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1200, height: 800 });
	const snitip = await openNodeSnitip(page);
	const hasPosition = () =>
		snitip.dialog.evaluate((el) => Boolean(el.style.left && el.style.top));
	await expect.poll(hasPosition).toBe(true);

	await page.setViewportSize({ width: 600, height: 800 });
	await expect.poll(hasPosition).toBe(false);
	await page.setViewportSize({ width: 1200, height: 800 });
	await expect.poll(hasPosition).toBe(true);
	expect(await snitip.dialog.evaluate((el) => el.matches(":modal"))).toBe(true);

	await page.keyboard.press("Escape");
	await expectClosed(snitip.button, snitip.dialog);
});

test("keeps the close button visible while the dialog scrolls", async ({
	page,
}) => {
	await page.setViewportSize({ width: 600, height: 320 });
	const snitip = await openNodeSnitip(page);
	const form = snitip.dialog.locator("form");
	const close = snitip.dialog.getByRole("button", {
		name: "Close tooltip",
	});
	const closePosition = () =>
		close.evaluate((button) => {
			const form = button.closest("dialog")?.querySelector("form");
			if (!form) throw new Error("Close tooltip button has no dialog form");
			const buttonRect = button.getBoundingClientRect();
			const formRect = form.getBoundingClientRect();
			return {
				top: Math.round(buttonRect.top - formRect.top),
				right: Math.round(formRect.right - buttonRect.right),
			};
		});

	await expect
		.poll(() =>
			form.evaluate((element) => element.scrollHeight > element.clientHeight),
		)
		.toBe(true);
	await expect(close).toBeInViewport({ ratio: 1 });
	const initialClosePosition = await closePosition();

	await form.evaluate((element) => (element.scrollTop = element.scrollHeight));
	await expect
		.poll(() => form.evaluate((element) => element.scrollTop))
		.toBeGreaterThan(1);
	await expect(close).toBeInViewport({ ratio: 1 });
	await expect.poll(closePosition).toEqual(initialClosePosition);

	await close.click();
	await expectClosed(snitip.button, snitip.dialog);
});

test("shows keyboard focus after a pointer click inside the dialog", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1200, height: 800 });
	const snitip = await loadNodeSnitip(page);
	const firstLink = snitip.dialog.locator("a[href]").first();
	const close = snitip.dialog.getByRole("button", {
		name: "Close tooltip",
	});

	await snitip.button.click();
	await expect(snitip.dialog).toBeVisible();
	await expect(snitip.title).toBeFocused();
	expect(await hasVisibleFocusOutline(snitip.title)).toBe(false);
	await snitip.dialog.locator("p").first().click();
	await page.keyboard.press("Tab");

	await expect(firstLink).toBeFocused();
	expect(
		await firstLink.evaluate((link) => link.matches(":focus-visible")),
	).toBe(true);

	await snitip.dialog.locator("p").first().click();
	await page.keyboard.press("Shift+Tab");
	await expect(close).toBeFocused();
	expect(
		await close.evaluate((button) => button.matches(":focus-visible")),
	).toBe(true);
});
