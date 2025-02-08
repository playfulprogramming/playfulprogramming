export const enableFootnoteSmoothScroll = () => {
	const prefersReducedMotion =
		window.matchMedia &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const footnoteRef = Array.from(
		document.querySelectorAll("[data-footnote-ref]"),
	);
	const footnoteBackref = Array.from(
		document.querySelectorAll("a.data-footnote-backref"),
	);

	for (const el of [...footnoteRef, ...footnoteBackref]) {
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

			return false;
		});
	}
};
