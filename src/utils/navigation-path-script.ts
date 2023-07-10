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
	// if the targeted element is nested inside another clickable anchor/button
	let target = e.target as HTMLElement;
	while (target !== e.currentTarget) {
		if (
			target.tagName.toLowerCase() === "a" ||
			target.tagName.toLowerCase() === "button"
		)
			return true;

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
				if (e.defaultPrevented) return;
				if (isNestedElement(e)) return;
				e.preventDefault();
			});

			// Handle middle click button - should open a new tab (cannot be detected via "click" event)
			// - prefer the "auxclick" event since it ensures that mousedown/mouseup both occur within the same element
			//   otherwise, using "mouseup" would activate on mouseup even when dragging between elements, which should not trigger a click
			el.addEventListener(
				// if "auxclick" is unsupported, fall back to "mouseup" for browser support (safari)
				"onauxclick" in el ? "auxclick" : "mouseup",
				(e: MouseEvent) => {
					// only handle middle click events
					if (e.button !== 1) return;

					if (e.defaultPrevented) return;
					if (isNestedElement(e)) return;

					e.preventDefault();
					window.open(path, "_blank");
					return false;
				}
			);

			// Use "click" to ensure that mousedown/mouseup both occur within the same element
			el.addEventListener("click", (e: MouseEvent) => {
				if (e.defaultPrevented) return;
				if (isNestedElement(e)) return;

				// only handle left click events
				if (e.button !== 0) return;
				// Download
				if (e.altKey) return;

				e.preventDefault();

				// Open in new tab
				if (e.metaKey || e.ctrlKey || e.shiftKey) {
					window.open(path, "_blank");
					return false;
				}

				// If text is selected, don't activate on mouseup (but ctrl+click should still work)
				const selection = window.getSelection();
				if (
					selection?.toString()?.length &&
					selection.containsNode(e.target as Node, true)
				)
					return;

				location.href = path;
			});
		});
};
