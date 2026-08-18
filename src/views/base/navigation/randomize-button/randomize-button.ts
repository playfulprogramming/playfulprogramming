import { updateBrandTheme, resetBrandTheme } from "src/utils/theming";

export const randomizeButtonListener = () => {
	const randomizeBtn = document.querySelector("#randomizebtn");
	if (!randomizeBtn) return;

	const randomizeChroma = true;

	let clicks = 0;
	randomizeBtn.addEventListener("click", () => {
		if (clicks < 10) {
			updateBrandTheme(document.documentElement, randomizeChroma);
			clicks++;
		} else {
			clicks = 0;
			resetBrandTheme(document.documentElement);
			console.log("Brand theme reset to default");
		}
	});
};
