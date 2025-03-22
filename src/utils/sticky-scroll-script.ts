/**
 * Uses a passive scroll event listener to detect when an element
 * is 'stuck' to the top of the page. When stuck, a [data-sticky="pinned"]
 * attribute is added to the element.
 */

export const enableStickyScrollListener = () => {
	const stickyElements = document.querySelectorAll<HTMLElement>(
		"[data-sticky-observer]",
	);
	const elementsData = Array.from(stickyElements).map((el) => {
		const rect = el.getBoundingClientRect();
		return {
			element: el,
			topPosition: rect.top,
		};
	});

	const updateElementsData = () => {
		elementsData.forEach((element) => {
			const rect = element.element.getBoundingClientRect();
			element.topPosition = rect.top + window.scrollY;
		});
	};

	const checkScrollPositions = () => {
		elementsData.forEach((data) => {
			data.element.dataset.sticky =
				window.scrollY > data.topPosition ? "pinned" : "";
		});
	};

	window.addEventListener("scroll", checkScrollPositions, { passive: true });
	window.addEventListener("resize", updateElementsData, { passive: true });

	checkScrollPositions();
};
