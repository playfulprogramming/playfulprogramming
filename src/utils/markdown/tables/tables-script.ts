export const enableTables = () => {
	const observer = new IntersectionObserver(
		([e]) => {
			(e.target as HTMLElement).dataset.sticky =
				e.intersectionRatio < 1 ? "pinned" : "";
		},
		{ threshold: [1] }
	);

	document.querySelectorAll("thead").forEach((e) => observer.observe(e));
};
