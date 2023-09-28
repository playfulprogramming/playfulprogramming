import {
	THEME_COLOR_DARK,
	THEME_COLOR_LIGHT,
	COLOR_MODE_STORAGE_KEY,
} from "constants/theme";

export const themeToggle = () => {
	const themeToggleBtn: HTMLElement = document.querySelector(
		"#theme-toggle-button",
	);
	if (!themeToggleBtn) return;
	const darkIconEl: HTMLElement = document.querySelector("#dark-icon");
	const lightIconEl: HTMLElement = document.querySelector("#light-icon");
	function toggleButton(theme) {
		themeToggleBtn.ariaPressed = `${theme === "dark"}`;
		if (theme === "light") {
			lightIconEl.style.display = null;
			darkIconEl.style.display = "none";
		} else {
			lightIconEl.style.display = "none";
			darkIconEl.style.display = null;
		}

		// update the meta theme-color attribute(s) based on the user preference
		const bgColor = theme === "light" ? THEME_COLOR_LIGHT : THEME_COLOR_DARK;
		// this needs to update both meta tags so that it applies regardless of prefers-color-scheme
		document
			.querySelectorAll("meta[name='theme-color']")
			.forEach((el) => el.setAttribute("content", bgColor));
	}

	// TODO: Migrate to `classList`
	const initialTheme = document.documentElement.className;
	toggleButton(initialTheme);
	themeToggleBtn.addEventListener("click", () => {
		const currentTheme = document.documentElement.className;
		document.documentElement.className =
			currentTheme === "light" ? "dark" : "light";
		// TODO: Persist new setting
		const newTheme = document.documentElement.className;
		toggleButton(newTheme);
		localStorage.setItem(COLOR_MODE_STORAGE_KEY, newTheme);
	});
};
