import { updateTheme } from "src/utils/theming";

export const randomizeButtonListener = () => {
	const randomizeBtn = document.querySelector("#randomizebtn");
	if (!randomizeBtn) return;

	const randomizeChroma = true;

	randomizeBtn.addEventListener("click", () => {
		updateTheme(document.documentElement, randomizeChroma);
	});
};
