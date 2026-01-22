export const enableSmoothScrollForAnchorsToCurrentPage = () => {
	const prefersReducedMotion =
		window.matchMedia &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const els = Array.from(document.querySelectorAll(`a[href^="#"]`));
	for (const el of els) {
		el.addEventListener("click", (e: Event) => {
			const href = (e.target as HTMLAnchorElement | null)?.getAttribute("href");
			if (!href) return;
			const target = document.querySelector(href);
			if (!target) return;
			const block =
				((e.target as HTMLAnchorElement | null)?.getAttribute(
					"data-scroll-block",
					// eslint-disable-next-line no-undef
				) as ScrollLogicalPosition | undefined) ?? "center";

			e.preventDefault();
			target.scrollIntoView({
				block,
				behavior: prefersReducedMotion ? "auto" : "smooth",
			});

			window.history.replaceState(null, "", href);
		});
	}
};
