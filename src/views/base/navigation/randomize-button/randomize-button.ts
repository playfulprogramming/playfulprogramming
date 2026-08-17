export const randomizeButtonListener = () => {
	const randomizeBtn = document.querySelector("#randomizebtn");

	if (!randomizeBtn) return;

	const randHue = () => Math.floor(Math.random() * 361);

	randomizeBtn.addEventListener("click", () => {
		const root = document.documentElement;
		const primary = String(randHue());
		const secondary = String(randHue());
		root.style.setProperty("--primary-hue", primary);
		root.style.setProperty("--secondary-hue", secondary);
	});
};
