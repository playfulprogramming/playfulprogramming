export const iFrameClickToRun = () => {
	const iframeButtons: HTMLElement[] = document.querySelectorAll(
		"[data-iframeurl] > button"
	) as never;

	[...iframeButtons].forEach((el) => {
		el.addEventListener("click", () => {
			const iframe = document.createElement("iframe");
			(iframe as any).loading = "lazy";
			iframe.src = el.parentElement.dataset.iframeurl;
			iframe.style.width = el.parentElement.style.width;
			iframe.style.height = el.parentElement.style.height;
			el.parentElement.replaceWith(iframe);
		});
	});
};
