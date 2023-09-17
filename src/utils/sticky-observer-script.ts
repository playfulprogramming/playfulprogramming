/**
 * Uses an intersection observer to detect when an element
 * is 'stuck' to the top of the page. When stuck, a [data-sticky="pinned"]
 * attribute is added to the element.
 *
 * The element *must* have `top: -1` in its styling for this
 * script to activate.
 */
export const enableStickyObserver = () => {
	const observer = new IntersectionObserver(
		([e]) => {
			(e.target as HTMLElement).dataset.sticky =
				e.intersectionRatio < 1 ? "pinned" : "";
		},
		{ threshold: [1] },
	);

	document
		.querySelectorAll("[data-sticky-observer]")
		.forEach((e) => observer.observe(e));
};
