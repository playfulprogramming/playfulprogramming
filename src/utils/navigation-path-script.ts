export const setupNavigationPaths = () => {
	document
		.querySelectorAll(`[data-navigation-path]`)
		.forEach((el: HTMLElement) => {
			const path = el.dataset.navigationPath;

			el.addEventListener("click", (e: MouseEvent) => {
				// a tags and buttons
				let target = e.target as HTMLElement;
				while (target !== e.currentTarget) {
					if (
						target.tagName.toLowerCase() === "a" ||
						target.tagName.toLowerCase() === "button"
					)
						return;

					// Nested
					if (target.getAttribute("data-navigation-path") !== null) return;

					// Explicitly don't bind
					if (target.getAttribute("data-dont-bind-navigate-click") === null)
						return;
					target = target.parentElement;
				}

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
