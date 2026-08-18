const BRAND_THEME_STORAGE_KEY = "brandTheme";

export const saveBrandTheme = (
	root: HTMLElement = document.documentElement,
) => {
	if (typeof window === "undefined") return;

	const theme = {
		"primary-hue": root.style.getPropertyValue("--primary-hue"),
		"secondary-hue": root.style.getPropertyValue("--secondary-hue"),
		"positive-hue": root.style.getPropertyValue("--positive-hue"),
		"error-hue": root.style.getPropertyValue("--error-hue"),
		chroma: root.style.getPropertyValue("--chroma"),
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

export const harmonize = (hue: number, tint: number, strength = 0.15) => {
	const offset = ((tint - hue + 540) % 360) - 180;
	return (hue + offset * strength + 360) % 360;
};

export const randHue = () => Math.floor(Math.random() * 360);

export const updateTheme = (
	root: HTMLElement = document.documentElement,
	randomizeChroma: boolean,
) => {
	const styles = getComputedStyle(root);

	const chroma = Number(styles.getPropertyValue("--chroma").trim() || 0);

	const positive = Number(
		styles.getPropertyValue("--positive-hue").trim() || 0,
	);

	const error = Number(styles.getPropertyValue("--error-hue").trim() || 0);

	const primary = randHue();
	const secondary = harmonize((primary + 120) % 360, primary);
	const harmonizedPositive = harmonize(positive, primary);
	const harmonizedError = harmonize(error, primary);

	root.style.setProperty("--primary-hue", String(primary));
	root.style.setProperty("--secondary-hue", String(secondary));
	root.style.setProperty("--positive-hue", String(harmonizedPositive));
	root.style.setProperty("--error-hue", String(harmonizedError));
	root.style.setProperty("--sticker_bowtie-dot", "var(--secondary70)");
	root.style.setProperty("--sticker_bowtie", "var(--secondary30)");

	if (randomizeChroma) {
		root.style.setProperty("--chroma", String(Math.random() * 2));
	}

	saveBrandTheme(root);
};
