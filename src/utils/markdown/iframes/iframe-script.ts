/**
 * Runs client-side to find iframe nodes and replace on click
 */
export const iFrameClickToRun = () => {
	const iframeButtons: HTMLElement[] = document.querySelectorAll(
		"[data-iframeurl] > button",
	) as never;

	[...iframeButtons].forEach((el) => {
		el.addEventListener("click", () => {
			const iframe = document.createElement("iframe");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(iframe as any).loading = "lazy";
			iframe.src = el.parentElement.dataset.iframeurl;
			const propsToPreserve = JSON.parse(
				el.parentElement.dataset.iframeprops || "{}",
			);
			for (const prop in propsToPreserve) {
				const val = propsToPreserve[prop];
				// Handle array props per hast spec:
				// @see https://github.com/syntax-tree/hast#propertyvalue
				if (Array.isArray(val)) {
					iframe.setAttribute(prop, val.join(" "));
					continue;
				}
				iframe.setAttribute(prop, propsToPreserve[prop]);
			}
			iframe.style.width = el.parentElement.style.width;
			iframe.style.height = el.parentElement.style.height;
			el.parentElement.replaceWith(iframe);
		});
	});
};
