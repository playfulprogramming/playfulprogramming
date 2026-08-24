import {
	BRAND_THEME_PROPERTIES,
	applyBrandTheme,
	applyColorMode,
	harmonize,
	readBrandTheme,
	readColorModePreference,
	saveBrandTheme,
	updateBrandTheme,
	type BrandTheme,
	type ColorModePreference,
} from "#src/utils/theming.ts";

type PaletteName = "primary" | "secondary";

const DEFAULT_PRIMARY_HUE = 245;
const DEFAULT_SECONDARY_HUE = 340;
const COLOR_OPTION_COUNT = 12;

const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;

const circularDistance = (first: number, second: number) =>
	Math.abs(((first - second + 540) % 360) - 180);

const normalizeFontFamily = (family: string) =>
	family
		.trim()
		.replace(/\s*,\s*/g, ",")
		.replace(/\s+/g, " ");

const getEffectiveNumber = (
	root: HTMLElement,
	property: string,
	fallbackProperty: string,
	fallback: number,
) => {
	const styles = getComputedStyle(root);
	const candidates = [
		root.style.getPropertyValue(property),
		styles.getPropertyValue(property),
		styles.getPropertyValue(fallbackProperty),
	];

	for (const candidate of candidates) {
		const parsed = Number.parseFloat(candidate.trim());
		if (Number.isFinite(parsed)) return parsed;
	}

	return fallback;
};

const getEffectiveHue = (root: HTMLElement, palette: PaletteName) =>
	normalizeHue(
		getEffectiveNumber(
			root,
			`--hue-${palette}`,
			`--pfp-hue-${palette}`,
			palette === "primary" ? DEFAULT_PRIMARY_HUE : DEFAULT_SECONDARY_HUE,
		),
	);

const generatePalette = (selectedHue: number, randomize: boolean) => {
	let hues: number[];

	if (randomize) {
		const uniqueHues = new Set<number>([Math.round(selectedHue)]);
		while (uniqueHues.size < COLOR_OPTION_COUNT) {
			const candidate = Math.floor(Math.random() * 360);
			if (
				[...uniqueHues].every(
					(existingHue) => circularDistance(candidate, existingHue) >= 12,
				)
			) {
				uniqueHues.add(candidate);
			}
		}

		hues = [...uniqueHues];
		for (let index = hues.length - 1; index > 0; index -= 1) {
			const swapIndex = Math.floor(Math.random() * (index + 1));
			[hues[index], hues[swapIndex]] = [hues[swapIndex], hues[index]];
		}
	} else {
		hues = Array.from(
			{ length: COLOR_OPTION_COUNT },
			(_, index) => index * (360 / COLOR_OPTION_COUNT),
		);
		const selectedIndex = hues.reduce(
			(closestIndex, hue, index) =>
				circularDistance(hue, selectedHue) <
				circularDistance(hues[closestIndex], selectedHue)
					? index
					: closestIndex,
			0,
		);
		hues[selectedIndex] = selectedHue;
	}

	return hues.map(normalizeHue);
};

const restoreBrandTheme = (root: HTMLElement, theme: BrandTheme) => {
	applyBrandTheme(theme, root);
};

const clearBrandThemePreview = (root: HTMLElement) => {
	applyBrandTheme(
		Object.fromEntries(
			BRAND_THEME_PROPERTIES.map((property) => [property, ""]),
		),
		root,
	);
};

const syncTriggerIcons = (root: HTMLElement) => {
	const isDark = root.classList.contains("dark");
	document
		.querySelectorAll<HTMLElement>("[data-theme-sidebar-trigger-icon='dark']")
		.forEach((icon) => (icon.hidden = isDark));
	document
		.querySelectorAll<HTMLElement>("[data-theme-sidebar-trigger-icon='light']")
		.forEach((icon) => (icon.hidden = !isDark));
};

export const initializeThemeSidebar = () => {
	const dialog = document.querySelector<HTMLDialogElement>(
		"[data-theme-sidebar]",
	);
	const form = dialog?.querySelector<HTMLFormElement>(
		"[data-theme-sidebar-form]",
	);
	const triggers = document.querySelectorAll<HTMLButtonElement>(
		"[data-theme-sidebar-trigger]",
	);

	if (!dialog || !form || triggers.length === 0) return;
	if (dialog.dataset.initialized === "true") return;
	dialog.dataset.initialized = "true";

	const root = document.documentElement;
	const closeButton = dialog.querySelector<HTMLButtonElement>(
		"[data-theme-sidebar-close]",
	);
	const resetButton =
		dialog.querySelector<HTMLButtonElement>("[data-theme-reset]");
	const shuffleButton = dialog.querySelector<HTMLButtonElement>(
		"[data-theme-shuffle]",
	);
	const refreshButton = dialog.querySelector<HTMLButtonElement>(
		"[data-theme-refresh-colors]",
	);
	const modeInputs =
		dialog.querySelectorAll<HTMLInputElement>("[data-theme-mode]");
	const fontSelects =
		dialog.querySelectorAll<HTMLSelectElement>("[data-theme-font]");

	let activeTrigger: HTMLButtonElement | undefined;
	let brandThemeBeforeOpen = readBrandTheme(root);
	let colorModeBeforeOpen = readColorModePreference();
	let previewColorMode: ColorModePreference = colorModeBeforeOpen;
	let saved = false;

	const setExpanded = (expanded: boolean) => {
		triggers.forEach((trigger) => {
			trigger.setAttribute("aria-expanded", String(expanded));
		});
	};

	const syncModeInputs = () => {
		modeInputs.forEach((input) => {
			input.checked = input.value === previewColorMode;
		});
	};

	const syncFontSelects = () => {
		const styles = getComputedStyle(root);

		fontSelects.forEach((select) => {
			const target = select.dataset.themeFont;
			if (target !== "brand" && target !== "body") return;

			const property = `--pfp-font-family-${target}`;
			const activeFamily = normalizeFontFamily(
				root.style.getPropertyValue(property) ||
					styles.getPropertyValue(property),
			);
			const matchingOption = [...select.options].find(
				(option) =>
					normalizeFontFamily(option.dataset.fontFamily ?? "") === activeFamily,
			);

			select.value = matchingOption?.value ?? select.options[0]?.value ?? "";
		});
	};

	const populatePalette = (palette: PaletteName, randomize = false) => {
		const paletteElement = dialog.querySelector<HTMLElement>(
			`[data-theme-palette='${palette}']`,
		);
		if (!paletteElement) return;

		const selectedHue = getEffectiveHue(root, palette);
		const hues = generatePalette(selectedHue, randomize);
		const options = paletteElement.querySelectorAll<HTMLInputElement>(
			"[data-theme-color-option]",
		);

		options.forEach((option, index) => {
			const hue = hues[index] ?? selectedHue;
			option.value = String(hue);
			option.checked = circularDistance(hue, selectedHue) < 0.01;
			const swatch = option.nextElementSibling as HTMLElement | null;
			swatch?.style.setProperty("--swatch-hue", String(hue));
		});
	};

	const populatePalettes = (randomize = false) => {
		populatePalette("primary", randomize);
		populatePalette("secondary", randomize);
	};

	const syncForm = () => {
		syncModeInputs();
		syncFontSelects();
		populatePalettes();
	};

	const updateSemanticHues = (primaryHue: number) => {
		const styles = getComputedStyle(root);
		const positiveHue =
			Number.parseFloat(styles.getPropertyValue("--pfp-hue-positive")) || 0;
		const errorHue =
			Number.parseFloat(styles.getPropertyValue("--pfp-hue-error")) || 0;

		root.style.setProperty(
			"--hue-positive",
			String(harmonize(positiveHue, primaryHue, true)),
		);
		root.style.setProperty(
			"--hue-error",
			String(harmonize(errorHue, primaryHue, true)),
		);
	};

	const open = (trigger: HTMLButtonElement) => {
		activeTrigger = trigger;
		brandThemeBeforeOpen = readBrandTheme(root);
		colorModeBeforeOpen = readColorModePreference();
		previewColorMode = colorModeBeforeOpen;
		saved = false;
		syncForm();
		setExpanded(true);
		dialog.showModal();
		closeButton?.focus();
	};

	triggers.forEach((trigger) => {
		trigger.addEventListener("click", () => open(trigger));
	});

	modeInputs.forEach((input) => {
		input.addEventListener("change", () => {
			if (!input.checked) return;
			previewColorMode = input.value as ColorModePreference;
			applyColorMode(previewColorMode, { persist: false });
			syncTriggerIcons(root);
		});
	});

	fontSelects.forEach((select) => {
		select.addEventListener("change", () => {
			const target = select.dataset.themeFont;
			const family = select.selectedOptions[0]?.dataset.fontFamily;
			if ((target !== "brand" && target !== "body") || !family) return;
			root.style.setProperty(`--pfp-font-family-${target}`, family);
		});
	});

	dialog
		.querySelectorAll<HTMLInputElement>("[data-theme-color-option]")
		.forEach((option) => {
			option.addEventListener("change", () => {
				if (!option.checked) return;
				const paletteElement = option.closest<HTMLElement>(
					"[data-theme-palette]",
				);
				const palette = paletteElement?.dataset.themePalette;
				if (palette !== "primary" && palette !== "secondary") return;

				const hue = normalizeHue(Number(option.value));
				root.style.setProperty(`--hue-${palette}`, String(hue));
				if (palette === "primary") updateSemanticHues(hue);
			});
		});

	shuffleButton?.addEventListener("click", () => {
		updateBrandTheme(root, true, false);
		populatePalettes(true);
	});

	refreshButton?.addEventListener("click", () => populatePalettes(true));

	resetButton?.addEventListener("click", () => {
		clearBrandThemePreview(root);
		previewColorMode = "system";
		applyColorMode(previewColorMode, { persist: false });
		syncTriggerIcons(root);
		syncForm();
	});

	closeButton?.addEventListener("click", () => dialog.close("cancel"));

	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) dialog.close("cancel");
	});

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		saveBrandTheme(root);
		applyColorMode(previewColorMode);
		saved = true;
		dialog.close("save");
	});

	dialog.addEventListener("close", () => {
		if (!saved) {
			restoreBrandTheme(root, brandThemeBeforeOpen);
			applyColorMode(colorModeBeforeOpen, { persist: false });
			previewColorMode = colorModeBeforeOpen;
		}

		syncTriggerIcons(root);
		setExpanded(false);
		activeTrigger?.focus();
		activeTrigger = undefined;
		saved = false;
	});

	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", () => {
		if (previewColorMode !== "system") return;
		applyColorMode("system", { persist: false });
		syncTriggerIcons(root);
	});

	syncTriggerIcons(root);
};
