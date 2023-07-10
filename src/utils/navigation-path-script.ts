import { Mouse } from "puppeteer-core";

/**
 * This allows items like cards to bind a click event to navigate to a path.
 *
 * Handles:
 * - Left clicks
 * - Middle clicks
 * - Ctrl + Left clicks
 * - Shift + Left clicks
 * - Meta + Left clicks
 *
 *
 * Ignores:
 * - Right clicks (used for context menus)
 * - Alt clicks (used for downloading)
 * - Default prevented events
 * - Nested elements with data-navigation-path
 * - Elements with [data-dont-bind-navigate-click]
 * - <a> tags and <button>s
 */
function isNestedElement(e: MouseEvent) {
	let target = e.target as HTMLElement;
	while (target !== e.currentTarget) {
		if (
			target.tagName.toLowerCase() === "a" ||
			target.tagName.toLowerCase() === "button"
		)
			return true;

		// Nested
		if (target.getAttribute("data-navigation-path") !== null) return true;

		// Explicitly don't bind
		if (target.getAttribute("data-dont-bind-navigate-click") !== null)
			return true;
		target = target.parentElement;
	}
	return false;
}

export const setupNavigationPaths = () => {
	document
		.querySelectorAll(`[data-navigation-path]`)
		.forEach((el: HTMLElement) => {
			const path = el.dataset.navigationPath;

			// Prevent middle click from starting a scroll
			el.addEventListener("mousedown", (e: MouseEvent) => {
				const isMiddleClick = e.button === 1;
				if (!isMiddleClick) return;
				if (isNestedElement(e)) return;
				if (e.defaultPrevented) return;
				e.preventDefault();
			});

			el.addEventListener("mouseup", (e: MouseEvent) => {
				// a tags and buttons, nested, and explicitly don't bind
				if (isNestedElement(e)) return;

				// Ignore right-clicks
				const isLeftClick = e.button === 0;
				const isMiddleClick = e.button === 1;
				if (!isLeftClick && !isMiddleClick) return;
				// Download
				if (e.altKey) return;

				if (e.defaultPrevented) return;

				e.preventDefault();

				// Open in new tab
				if (e.metaKey || e.ctrlKey || e.shiftKey || isMiddleClick) {
					window.open(path, "_blank");
					return false;
				}
				location.href = path;
			});
		});
};
