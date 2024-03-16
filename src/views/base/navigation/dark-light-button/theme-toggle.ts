import {
	THEME_COLOR_DARK,
	THEME_COLOR_LIGHT,
	COLOR_MODE_STORAGE_KEY,
} from "constants/theme";

export const themeToggle = () => {
	const themeToggleBtns = document.querySelectorAll<HTMLButtonElement>(
		"[data-theme-toggle]",
	);

	const darkIconEls = document.querySelectorAll<HTMLElement>(
		"[data-theme-toggle-icon='dark']",
	);
	const lightIconEls = document.querySelectorAll<HTMLElement>(
		"[data-theme-toggle-icon='light']",
	);
	function toggleButton(theme: string) {
		themeToggleBtns.forEach((el) => (el.ariaPressed = `${theme === "dark"}`));
		lightIconEls.forEach((el) => {
			el.style.display = theme === "light" ? "" : "none";
		});
		darkIconEls.forEach((el) => {
			el.style.display = theme === "light" ? "none" : "";
		});

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

	const handleClick = () => {
		const currentTheme = document.documentElement.className;
		document.documentElement.className =
			currentTheme === "light" ? "dark" : "light";
		// TODO: Persist new setting
		const newTheme = document.documentElement.className;
		toggleButton(newTheme);
		localStorage.setItem(COLOR_MODE_STORAGE_KEY, newTheme);
	};

	themeToggleBtns.forEach((el) => el.addEventListener("click", handleClick));
};
