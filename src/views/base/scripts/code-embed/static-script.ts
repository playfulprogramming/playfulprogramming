for (const containerEl of Array.from(
	document.querySelectorAll<HTMLElement>("[data-code-embed=static]"),
)) {
	const formEl = containerEl.querySelector<HTMLFormElement>(
		"#code-embed-address",
	)!;
	const addressEl = formEl.querySelector<HTMLInputElement>(
		'input[name="address"]',
	)!;
	const reloadButtonEl = containerEl.querySelector<HTMLButtonElement>(
		"#code-embed-reload-preview",
	)!;
	const previewContainerEl = containerEl.querySelector<HTMLElement>(
		"#code-embed-preview-container",
	)!;
	let iframeEl = previewContainerEl.querySelector<HTMLIFrameElement>("iframe")!;
	const previewUrl = iframeEl.src;
	const addressUrl = addressEl.value;

	function replaceIframe(newSrc: string) {
		const newIframeEl = document.createElement("iframe");
		newIframeEl.src = newSrc;

		iframeEl.replaceWith(newIframeEl);
		iframeEl = newIframeEl;
		bindIframeEvents();
	}

	reloadButtonEl.addEventListener("click", (e) => {
		e.preventDefault();
		formEl.reset();

		const newSrc = modifyPreviewUrl(previewUrl, addressEl.value);
		replaceIframe(newSrc);
	});

	function handleSubmitAddress() {
		const newSrc = modifyPreviewUrl(previewUrl, addressEl.value);
		updateAddressUrl(newSrc);

		if (newSrc != iframeEl.src) {
			replaceIframe(newSrc);
		}
	}

	formEl.addEventListener("submit", (e) => {
		e.preventDefault();
		handleSubmitAddress();
	});

	addressEl.addEventListener("blur", handleSubmitAddress);

	function bindIframeEvents() {
		// If the iframe is navigated, modify the address bar to reflect the new URL
		iframeEl.addEventListener("load", () => {
			if (iframeEl.src) {
				updateAddressUrl(iframeEl.src);
			}
		});
	}

	bindIframeEvents();

	function updateAddressUrl(src: string) {
		const url = new URL(src);
		const address = new URL(addressUrl);
		url.hostname = "localhost";
		url.port = "";
		url.pathname = address.pathname;
		addressEl.value = url.toString();
	}
}

// Given the base static URL, modify it with any changes made in the address bar
function modifyPreviewUrl(previewUrl: string, addressUrl: string) {
	const newUrl = new URL(addressUrl, "http://localhost/");
	const srcUrl = new URL(previewUrl);
	srcUrl.search = newUrl.search;
	srcUrl.hash = newUrl.hash;

	return srcUrl.toString();
}
