export const setupNavigationPaths = () => {
	document.querySelectorAll(`[navigation-path]`).forEach((el) => {
		const path = el.getAttribute("navigation-path");

		el.addEventListener("click", (e: MouseEvent) => {
			// Ignore right-clicks
			if (e.button !== 0) return;
			// Download
			if (e.altKey) return;

			if (e.defaultPrevented) return;

			e.preventDefault();

			// Open in new tab
			if (e.metaKey || e.ctrlKey || e.shiftKey) {
				window.open(path, "_blank");
				return;
			}
			location.href = path;
		});
	});
};
