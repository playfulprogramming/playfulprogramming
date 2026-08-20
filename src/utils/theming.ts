import { BRAND_THEME_STORAGE_KEY } from "../constants/theme.ts";

export const saveBrandTheme = (
	root: HTMLElement = document.documentElement,
) => {
	if (typeof window === "undefined") return;

	const theme = {
		"hue-primary": root.style.getPropertyValue("--hue-primary"),
		"hue-secondary": root.style.getPropertyValue("--hue-secondary"),
		"hue-positive": root.style.getPropertyValue("--hue-positive"),
		"hue-error": root.style.getPropertyValue("--hue-error"),
		"chroma-factor": root.style.getPropertyValue("--chroma-factor"),
	};

	localStorage.setItem(BRAND_THEME_STORAGE_KEY, JSON.stringify(theme));
};

export const loadBrandTheme = (
	root: HTMLElement = document.documentElement,
) => {
	if (typeof window === "undefined") return;

	const saved = localStorage.getItem(BRAND_THEME_STORAGE_KEY);
	if (!saved) return;

	try {
		const theme = JSON.parse(saved) as Record<string, string>;

		Object.entries(theme).forEach(([key, value]) => {
			if (value) {
				root.style.setProperty(`--${key}`, String(value));
			}
		});
	} catch {
		// ignore malformed
	}
};

export const resetBrandTheme = (
	root: HTMLElement = document.documentElement,
) => {
	root.style.removeProperty("--hue-primary");
	root.style.removeProperty("--hue-secondary");
	root.style.removeProperty("--hue-positive");
	root.style.removeProperty("--hue-error");
	root.style.removeProperty("--chroma-factor");
	localStorage.removeItem(BRAND_THEME_STORAGE_KEY);
};

export const harmonize = (
	hue: number,
	tint: number,
	isSemantic: boolean = false,
	strength = 0.15,
) => {
	const limit = 10;
	const offset = ((tint - hue + 540) % 360) - 180;
	const result = hue + offset * strength;

	return (
		(isSemantic
			? Math.min(Math.max(result, hue - limit), hue + limit)
			: result + 360) % 360
	);
};

export const randHue = () => Math.floor(Math.random() * 360);

export const updateBrandTheme = (
	root: HTMLElement = document.documentElement,
	randomizeChroma: boolean,
) => {
	const styles = getComputedStyle(root);

	const positive = Number(
		styles.getPropertyValue("--pfp-hue-positive").trim() || 0,
	);

	const error = Number(styles.getPropertyValue("--pfp-hue-error").trim() || 0);

	const primary = randHue();
	const secondary = harmonize((primary + 120) % 360, primary);
	const harmonizedPositive = harmonize(positive, primary, true);
	const harmonizedError = harmonize(error, primary, true);

	root.style.setProperty("--hue-primary", String(primary));
	root.style.setProperty("--hue-secondary", String(secondary));
	root.style.setProperty("--hue-positive", String(harmonizedPositive));
	root.style.setProperty("--hue-error", String(harmonizedError));

	if (randomizeChroma) {
		root.style.setProperty("--chroma-factor", String(Math.random() * 2));
	}

	saveBrandTheme(root);
};
