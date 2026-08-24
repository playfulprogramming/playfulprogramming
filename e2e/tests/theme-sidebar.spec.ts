import { expect, test, type Locator, type Page } from "@playwright/test";

const HEADING_FONT = '"Playpen Sans", "Arial", sans-serif';
const BODY_FONT =
	'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

async function openThemeSidebar(page: Page) {
	const trigger = page.getByRole("button", {
		name: "Customize theme",
		exact: true,
	});
	const dialog = page.locator("[data-theme-sidebar]");

	await trigger.click();
	await expect(dialog).toBeVisible();

	return { dialog, trigger };
}

async function chooseMode(dialog: Locator, mode: "Dark" | "Light" | "System") {
	await chooseRadio(
		dialog,
		dialog.getByRole("radio", { name: mode, exact: true }),
	);
}

async function chooseRadio(dialog: Locator, radio: Locator) {
	const id = await radio.getAttribute("id");
	if (!id) throw new Error("Expected the theme radio to have an id");

	await dialog.locator(`label[for="${id}"]`).click();
	await expect(radio).toBeChecked();
}

async function choosePrimaryColor(dialog: Locator) {
	await chooseRadio(
		dialog,
		dialog.getByRole("radio", {
			name: "Primary color option: 4",
			exact: true,
		}),
	);
}

async function readRootTheme(page: Page) {
	return page.evaluate(() => {
		const root = document.documentElement;
		const property = (name: string) => root.style.getPropertyValue(name).trim();

		return {
			isDark: root.classList.contains("dark"),
			isLight: root.classList.contains("light"),
			primaryHue: property("--hue-primary"),
			secondaryHue: property("--hue-secondary"),
			positiveHue: property("--hue-positive"),
			errorHue: property("--hue-error"),
			chromaFactor: property("--chroma-factor"),
			headingFont: property("--pfp-font-family-brand"),
			bodyFont: property("--pfp-font-family-body"),
		};
	});
}

async function readStoredTheme(page: Page) {
	return page.evaluate(() => {
		const brandTheme = localStorage.getItem("brandTheme");

		return {
			currentTheme: localStorage.getItem("currentTheme"),
			brandTheme: brandTheme
				? (JSON.parse(brandTheme) as Record<string, string>)
				: null,
		};
	});
}

test.describe("theme sidebar", () => {
	test.beforeEach(async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/posts/example", { waitUntil: "networkidle" });
	});

	test("exposes the dialog relationship and manages focus", async ({
		page,
	}) => {
		const trigger = page.getByRole("button", {
			name: "Customize theme",
			exact: true,
		});
		const dialogElement = page.locator("[data-theme-sidebar]");

		await expect(trigger).toHaveAttribute("aria-controls", "theme-sidebar");
		await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(dialogElement).not.toHaveAttribute("open", "");

		await trigger.click();

		const dialog = page.getByRole("dialog", {
			name: "Customize theme",
			exact: true,
		});
		const closeButton = dialog.getByRole("button", {
			name: "Close theme customizer",
			exact: true,
		});
		await expect(dialog).toBeVisible();
		await expect(trigger).toHaveAttribute("aria-expanded", "true");
		await expect(closeButton).toBeFocused();
		await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

		await closeButton.click();

		await expect(dialogElement).toBeHidden();
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(trigger).toBeFocused();
	});

	test("Escape and the close button revert live previews", async ({ page }) => {
		const initialTheme = await readRootTheme(page);
		const { dialog, trigger } = await openThemeSidebar(page);

		await chooseMode(dialog, "Dark");
		await dialog
			.locator('[data-theme-font="brand"]')
			.selectOption("playpen-sans");
		await choosePrimaryColor(dialog);

		await expect(page.locator("html")).toHaveClass(/\bdark\b/);
		expect(await readRootTheme(page)).not.toEqual(initialTheme);

		await page.keyboard.press("Escape");

		await expect(dialog).toBeHidden();
		await expect(trigger).toBeFocused();
		expect(await readRootTheme(page)).toEqual(initialTheme);
		expect(await readStoredTheme(page)).toEqual({
			brandTheme: null,
			currentTheme: null,
		});

		const reopened = await openThemeSidebar(page);
		await chooseMode(reopened.dialog, "Dark");
		await reopened.dialog
			.locator('[data-theme-font="body"]')
			.selectOption("system-ui");
		await reopened.dialog
			.getByRole("button", {
				name: "Close theme customizer",
				exact: true,
			})
			.click();

		await expect(reopened.dialog).toBeHidden();
		await expect(reopened.trigger).toBeFocused();
		expect(await readRootTheme(page)).toEqual(initialTheme);

		await page.emulateMedia({ colorScheme: "dark" });
		await expect(page.locator("html")).toHaveClass(/\bdark\b/);
		expect((await readStoredTheme(page)).currentTheme).toBeNull();
	});

	test("saves color mode, fonts, and color across reloads", async ({
		page,
	}) => {
		const { dialog } = await openThemeSidebar(page);

		await chooseMode(dialog, "Dark");
		await dialog
			.locator('[data-theme-font="brand"]')
			.selectOption("playpen-sans");
		await dialog.locator('[data-theme-font="body"]').selectOption("system-ui");
		await choosePrimaryColor(dialog);
		await dialog
			.getByRole("button", { name: "Save changes", exact: true })
			.click();

		await expect(dialog).toBeHidden();
		let rootTheme = await readRootTheme(page);
		expect(rootTheme).toMatchObject({
			bodyFont: BODY_FONT,
			headingFont: HEADING_FONT,
			isDark: true,
			isLight: false,
			primaryHue: "90",
		});
		let storedTheme = await readStoredTheme(page);
		expect(storedTheme.currentTheme).toBe("dark");
		expect(storedTheme.brandTheme).toMatchObject({
			"hue-primary": "90",
			"pfp-font-family-body": BODY_FONT,
			"pfp-font-family-brand": HEADING_FONT,
		});

		await page.reload({ waitUntil: "networkidle" });

		rootTheme = await readRootTheme(page);
		expect(rootTheme).toMatchObject({
			bodyFont: BODY_FONT,
			headingFont: HEADING_FONT,
			isDark: true,
			isLight: false,
			primaryHue: "90",
		});
		storedTheme = await readStoredTheme(page);
		expect(storedTheme.currentTheme).toBe("dark");
		expect(storedTheme.brandTheme).toMatchObject({
			"hue-primary": "90",
			"pfp-font-family-body": BODY_FONT,
			"pfp-font-family-brand": HEADING_FONT,
		});
	});

	test("saving System removes the explicit color-mode preference", async ({
		page,
	}) => {
		await page.evaluate(() => localStorage.setItem("currentTheme", "dark"));
		await page.reload({ waitUntil: "networkidle" });
		await expect(page.locator("html")).toHaveClass(/\bdark\b/);

		const { dialog } = await openThemeSidebar(page);
		await chooseMode(dialog, "System");
		await dialog
			.getByRole("button", { name: "Save changes", exact: true })
			.click();

		await expect(page.locator("html")).toHaveClass(/\blight\b/);
		expect((await readStoredTheme(page)).currentTheme).toBeNull();

		await page.reload({ waitUntil: "networkidle" });
		await expect(page.locator("html")).toHaveClass(/\blight\b/);
		expect((await readStoredTheme(page)).currentTheme).toBeNull();
	});

	test("Reset and Save restore the site defaults", async ({ page }) => {
		let sidebar = await openThemeSidebar(page);
		await chooseMode(sidebar.dialog, "Dark");
		await sidebar.dialog
			.locator('[data-theme-font="brand"]')
			.selectOption("playpen-sans");
		await sidebar.dialog
			.locator('[data-theme-font="body"]')
			.selectOption("system-ui");
		await choosePrimaryColor(sidebar.dialog);
		await sidebar.dialog
			.getByRole("button", { name: "Save changes", exact: true })
			.click();
		expect((await readStoredTheme(page)).brandTheme).not.toBeNull();

		sidebar = await openThemeSidebar(page);
		await sidebar.dialog
			.getByRole("button", { name: "Reset", exact: true })
			.click();

		await expect(
			sidebar.dialog.getByRole("radio", { name: "System", exact: true }),
		).toBeChecked();
		await expect(
			sidebar.dialog.locator('[data-theme-font="brand"]'),
		).toHaveValue("figtree");
		await expect(
			sidebar.dialog.locator('[data-theme-font="body"]'),
		).toHaveValue("figtree");
		expect(await readRootTheme(page)).toEqual({
			bodyFont: "",
			chromaFactor: "",
			errorHue: "",
			headingFont: "",
			isDark: false,
			isLight: true,
			positiveHue: "",
			primaryHue: "",
			secondaryHue: "",
		});

		await sidebar.dialog
			.getByRole("button", { name: "Save changes", exact: true })
			.click();

		expect(await readStoredTheme(page)).toEqual({
			brandTheme: null,
			currentTheme: null,
		});

		await page.reload({ waitUntil: "networkidle" });
		expect(await readRootTheme(page)).toEqual({
			bodyFont: "",
			chromaFactor: "",
			errorHue: "",
			headingFont: "",
			isDark: false,
			isLight: true,
			positiveHue: "",
			primaryHue: "",
			secondaryHue: "",
		});
		expect((await readStoredTheme(page)).brandTheme).toBeNull();
	});

	test("fits the theme dialog inside a mobile viewport", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		const { dialog } = await openThemeSidebar(page);

		const bounds = await dialog.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return {
				bottom: rect.bottom,
				left: rect.left,
				right: rect.right,
				top: rect.top,
				viewportHeight: window.innerHeight,
				viewportWidth: window.innerWidth,
			};
		});

		expect(bounds.left).toBeGreaterThanOrEqual(-1);
		expect(bounds.top).toBeGreaterThanOrEqual(-1);
		expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth + 1);
		expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight + 1);
	});
});
