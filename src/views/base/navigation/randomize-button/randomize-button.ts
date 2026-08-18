export const randomizeButtonListener = () => {
	const randomizeBtn = document.querySelector("#randomizebtn");

	if (!randomizeBtn) return;

	const randHue = () => Math.floor(Math.random() * 361);

	randomizeBtn.addEventListener("click", () => {
		const root = document.documentElement;
		const primary = randHue();
		const secondary = (primary + 120) % 360;
		root.style.setProperty("--primary-hue", String(primary));
		root.style.setProperty("--secondary-hue", String(secondary));

		root.style.setProperty("--sticker_bowtie-dot", `var(--secondary70)`);
		root.style.setProperty("--sticker_bowtie", `var(--secondary30)`);
	});
};
