import { expect, test, type Locator, type Page } from "@playwright/test";

const OPEN_DYSLEXIC_FONT = '"OpenDyslexic", "Arial", sans-serif';

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
		dialog.locator(`[data-theme-mode][value="${mode.toLowerCase()}"]`),
	);
}

async function chooseContrast(
	dialog: Locator,
	mode: "More" | "Less" | "System",
) {
	await chooseRadio(
		dialog,
		dialog.locator(`[data-theme-contrast][value="${mode.toLowerCase()}"]`),
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
			isContrastMore: root.classList.contains("contrast-more"),
			isContrastLess: root.classList.contains("contrast-less"),
			primaryHue: property("--hue-primary"),
			secondaryHue: property("--hue-secondary"),
			positiveHue: property("--hue-positive"),
			errorHue: property("--hue-error"),
			headingFont: property("--pfp-font-family-brand"),
			bodyFont: property("--pfp-font-family-body"),
		};
	});
}

async function readContrastTokens(page: Page) {
	return page.evaluate(() => {
		const styles = getComputedStyle(document.documentElement);

		return {
			backgroundPrimary: styles.getPropertyValue("--background_primary").trim(),
			foregroundHigh: styles.getPropertyValue("--foreground_high").trim(),
			neutralOpacity: styles
				.getPropertyValue("--opacity-neutral-medium")
				.trim(),
		};
	});
}

async function readStoredTheme(page: Page) {
	return page.evaluate(() => {
		const brandTheme = localStorage.getItem("brandTheme");

		return {
			currentTheme: localStorage.getItem("currentTheme"),
			contrastMode: localStorage.getItem("contrastMode"),
			brandTheme: brandTheme
				? (JSON.parse(brandTheme) as Record<string, string>)
				: null,
		};
	});
}

test.describe("theme sidebar", () => {
	test.beforeEach(async ({ page }) => {
		await page.emulateMedia({
			colorScheme: "light",
			contrast: "no-preference",
		});
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
		await chooseContrast(dialog, "More");
		await dialog
			.locator('[data-theme-font="brand"]')
			.selectOption("playpen-sans");
		await choosePrimaryColor(dialog);

		await expect(page.locator("html")).toHaveClass(/\bdark\b/);
		await expect(page.locator("html")).toHaveClass(/\bcontrast-more\b/);
		expect(await readRootTheme(page)).not.toEqual(initialTheme);

		await page.keyboard.press("Escape");

		await expect(dialog).toBeHidden();
		await expect(trigger).toBeFocused();
		expect(await readRootTheme(page)).toEqual(initialTheme);
		expect(await readStoredTheme(page)).toEqual({
			brandTheme: null,
			contrastMode: null,
			currentTheme: null,
		});

		const reopened = await openThemeSidebar(page);
		await chooseMode(reopened.dialog, "Dark");
		await chooseContrast(reopened.dialog, "Less");
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

	test("saves color mode, contrast, fonts, and color across reloads", async ({
		page,
	}) => {
		const { dialog } = await openThemeSidebar(page);

		await chooseMode(dialog, "Dark");
		const darkBackground = (await readContrastTokens(page)).backgroundPrimary;
		await chooseContrast(dialog, "More");
		expect((await readContrastTokens(page)).backgroundPrimary).toBe(
			darkBackground,
		);
		await dialog
			.locator('[data-theme-font="brand"]')
			.selectOption("open-dyslexic");
		await dialog
			.locator('[data-theme-font="body"]')
			.selectOption("open-dyslexic");
		expect(
			await page.evaluate(async () => {
				const faces = await Promise.all([
					document.fonts.load('400 16px "OpenDyslexic"'),
					document.fonts.load('700 16px "OpenDyslexic"'),
					document.fonts.load('italic 400 16px "OpenDyslexic"'),
					document.fonts.load('italic 700 16px "OpenDyslexic"'),
				]);
				return faces.every((matches) => matches.length > 0);
			}),
		).toBe(true);
		await choosePrimaryColor(dialog);
		await dialog
			.getByRole("button", { name: "Save changes", exact: true })
			.click();

		await expect(dialog).toBeHidden();
		let rootTheme = await readRootTheme(page);
		expect(rootTheme).toMatchObject({
			bodyFont: OPEN_DYSLEXIC_FONT,
			headingFont: OPEN_DYSLEXIC_FONT,
			isContrastLess: false,
			isContrastMore: true,
			isDark: true,
			isLight: false,
			primaryHue: "90",
		});
		let storedTheme = await readStoredTheme(page);
		expect(storedTheme.currentTheme).toBe("dark");
		expect(storedTheme.contrastMode).toBe("more");
		expect(storedTheme.brandTheme).toMatchObject({
			"hue-primary": "90",
			"pfp-font-family-body": "open-dyslexic",
			"pfp-font-family-brand": "open-dyslexic",
		});
		expect(storedTheme.brandTheme).not.toHaveProperty("chroma-factor");

		await page.reload({ waitUntil: "networkidle" });

		rootTheme = await readRootTheme(page);
		expect(rootTheme).toMatchObject({
			bodyFont: OPEN_DYSLEXIC_FONT,
			headingFont: OPEN_DYSLEXIC_FONT,
			isContrastLess: false,
			isContrastMore: true,
			isDark: true,
			isLight: false,
			primaryHue: "90",
		});
		storedTheme = await readStoredTheme(page);
		expect(storedTheme.currentTheme).toBe("dark");
		expect(storedTheme.contrastMode).toBe("more");
		expect(storedTheme.brandTheme).toMatchObject({
			"hue-primary": "90",
			"pfp-font-family-body": "open-dyslexic",
			"pfp-font-family-brand": "open-dyslexic",
		});
		expect(storedTheme.brandTheme).not.toHaveProperty("chroma-factor");
	});

	test("More forces contrast when the system does not request it", async ({
		page,
	}) => {
		const root = page.locator("html");
		const defaultTokens = await readContrastTokens(page);
		const { dialog } = await openThemeSidebar(page);

		await chooseContrast(dialog, "More");

		await expect(root).toHaveClass(/\bcontrast-more\b/);
		await expect(root).not.toHaveClass(/\bcontrast-less\b/);
		const moreTokens = await readContrastTokens(page);
		expect(moreTokens.foregroundHigh).not.toBe(defaultTokens.foregroundHigh);
		expect(moreTokens.neutralOpacity).not.toBe(defaultTokens.neutralOpacity);
	});

	test("Less overrides system contrast and System follows the media query", async ({
		page,
	}) => {
		const root = page.locator("html");
		const defaultTokens = await readContrastTokens(page);

		await page.emulateMedia({ contrast: "more" });
		const moreTokens = await readContrastTokens(page);
		expect(moreTokens.foregroundHigh).not.toBe(defaultTokens.foregroundHigh);
		expect(moreTokens.neutralOpacity).not.toBe(defaultTokens.neutralOpacity);
		await expect(root).not.toHaveClass(/\bcontrast-(?:more|less)\b/);

		let sidebar = await openThemeSidebar(page);
		await chooseContrast(sidebar.dialog, "Less");
		await expect(root).toHaveClass(/\bcontrast-less\b/);
		await expect(root).not.toHaveClass(/\bcontrast-more\b/);
		expect(await readContrastTokens(page)).toEqual(defaultTokens);
		await sidebar.dialog
			.getByRole("button", { name: "Save changes", exact: true })
			.click();

		expect((await readStoredTheme(page)).contrastMode).toBe("less");
		await page.reload({ waitUntil: "networkidle" });
		await expect(root).toHaveClass(/\bcontrast-less\b/);
		expect(await readContrastTokens(page)).toEqual(defaultTokens);

		sidebar = await openThemeSidebar(page);
		await chooseContrast(sidebar.dialog, "System");
		await sidebar.dialog
			.getByRole("button", { name: "Save changes", exact: true })
			.click();

		await expect(root).not.toHaveClass(/\bcontrast-(?:more|less)\b/);
		expect((await readStoredTheme(page)).contrastMode).toBeNull();
		expect(await readContrastTokens(page)).toEqual(moreTokens);

		await page.emulateMedia({ contrast: "no-preference" });
		expect(await readContrastTokens(page)).toEqual(defaultTokens);
	});

	test("disables the bowtie animation for a custom primary color", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "networkidle" });
		const bowtieButton = page.locator("#bowtie-button");

		await expect(bowtieButton).not.toHaveAttribute(
			"data-bowtie-animation-disabled",
			"",
		);

		const { dialog } = await openThemeSidebar(page);
		await choosePrimaryColor(dialog);
		await dialog
			.getByRole("button", { name: "Save changes", exact: true })
			.click();

		await expect(bowtieButton).toHaveAttribute(
			"data-bowtie-animation-disabled",
			"",
		);

		await page.reload({ waitUntil: "networkidle" });
		await expect(page.locator("#bowtie-button")).toHaveAttribute(
			"data-bowtie-animation-disabled",
			"",
		);
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
		await chooseContrast(sidebar.dialog, "More");
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
			sidebar.dialog.locator('[data-theme-mode][value="system"]'),
		).toBeChecked();
		await expect(
			sidebar.dialog.locator('[data-theme-contrast][value="system"]'),
		).toBeChecked();
		await expect(
			sidebar.dialog.locator('[data-theme-font="brand"]'),
		).toHaveValue("figtree");
		await expect(
			sidebar.dialog.locator('[data-theme-font="body"]'),
		).toHaveValue("figtree");
		expect(await readRootTheme(page)).toEqual({
			bodyFont: "",
			errorHue: "",
			headingFont: "",
			isContrastLess: false,
			isContrastMore: false,
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
			contrastMode: null,
			currentTheme: null,
		});

		await page.reload({ waitUntil: "networkidle" });
		expect(await readRootTheme(page)).toEqual({
			bodyFont: "",
			errorHue: "",
			headingFont: "",
			isContrastLess: false,
			isContrastMore: false,
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
