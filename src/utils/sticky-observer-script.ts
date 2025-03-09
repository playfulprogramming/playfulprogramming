/**
 * Uses an intersection observer to detect when an element
 * is 'stuck' to the top of the page. When stuck, a [data-sticky="pinned"]
 * attribute is added to the element.
 *
 * The element *must* have `top: -1` in its styling for this
 * script to activate.
 */
export const enableStickyObserver = () => {
	document
		.querySelectorAll<HTMLElement>("[data-sticky-observer]")
		.forEach((el: HTMLElement) => {
			new IntersectionObserver(
				([e]) => {
					(e.target as HTMLElement).dataset.sticky =
						e.intersectionRatio < 1 ? "pinned" : "";
				},
				{
					threshold: [1],
					rootMargin: 0 - parseInt(getComputedStyle(el).top) + "px",
				},
			).observe(el);
		});
};
