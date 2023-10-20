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
			const parent = el.parentElement!;
			iframe.loading = "lazy";
			iframe.src = String(parent.dataset.iframeurl);
			const propsToPreserve = JSON.parse(parent.dataset.iframeprops || "{}");
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
			iframe.style.width = parent.style.width;
			iframe.style.height = parent.style.height;
			parent.replaceWith(iframe);
		});
	});
};
