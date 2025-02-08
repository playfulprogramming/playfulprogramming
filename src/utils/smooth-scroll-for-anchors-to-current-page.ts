export const enableSmoothScrollForAnchorsToCurrentPage = () => {
	const prefersReducedMotion =
		window.matchMedia &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const els = Array.from(document.querySelectorAll(`.post-body a[href^="#"]`));
	console.log(els);
	for (const el of els) {
		el.addEventListener("click", (e: Event) => {
			e.preventDefault();

			const href = (e.target as HTMLAnchorElement | null)?.getAttribute("href");
			if (!href) return;
			const target = document.querySelector(href);
			if (!target) return;

			target.scrollIntoView({
				block: "center",
				behavior: prefersReducedMotion ? "auto" : "smooth",
			});

			window.history.replaceState(null, "", href);
		});
	}
};
