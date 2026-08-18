export const harmonize = (hue: number, tint: number, strength = 0.15) => {
	const d = ((tint - hue + 540) % 360) - 180;
	return (hue + d * strength + 360) % 360;
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
};
