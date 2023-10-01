/**
 * Scrollable code-container blocks should have tabindex="0" for keyboard accessibility.
 *
 * These are added in rehype-transform, but can be removed with JS on elements that
 * cannot be horizontally scrolled.
 *
 * https://github.com/unicorn-utterances/unicorn-utterances/issues/738
 */
export const enableTwoslashTabindex = () => {
	const codeContainerEls = document.querySelectorAll("div.code-container");

	const handleResize = () => {
		codeContainerEls.forEach((el) => {
			const canScroll = el.scrollWidth > el.clientWidth;
			if (canScroll) {
				el.setAttribute("tabindex", "0");
			} else {
				el.removeAttribute("tabindex");
			}
		});
	};

	handleResize();
	window.addEventListener("resize", handleResize);
};
