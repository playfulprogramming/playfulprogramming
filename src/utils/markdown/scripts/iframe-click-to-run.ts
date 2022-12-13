export const iFrameClickToRun = () => {
	const iframeButtons: HTMLElement[] = document.querySelectorAll(
		"[data-iframeurl] > button"
	) as never;

	[...iframeButtons].forEach((el) => {
		el.addEventListener("click", () => {
			const iframe = document.createElement("iframe");
			(iframe as any).loading = "lazy";
			iframe.src = el.parentElement.dataset.iframeurl;
			iframe.height = el.parentElement.dataset.height;
			iframe.width = el.parentElement.dataset.width;
			el.parentElement.replaceWith(iframe);
		});
	});
};
