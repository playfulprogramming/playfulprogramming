export const setupNavigationPaths = () => {
	document
		.querySelectorAll(`[data-navigation-path]`)
		.forEach((el: HTMLElement) => {
			const path = el.dataset.navigationPath;

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
