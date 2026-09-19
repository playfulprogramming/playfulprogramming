import { isInlinePreviewSource } from "./inline-preview.ts";

for (const iframe of document.querySelectorAll<HTMLIFrameElement>(
	"iframe[data-no-frame]",
)) {
	if (!isInlinePreviewSource(iframe.getAttribute("src") ?? "")) continue;

	iframe.style.display = "block";
	iframe.style.width = "100%";
	iframe.style.border = "0";

	const hasTitle = iframe.hasAttribute("title");
	let observer: ResizeObserver | undefined;

	const fitPreview = () => {
		observer?.disconnect();

		if (!isInlinePreviewSource(iframe.getAttribute("src") ?? "")) return;

		try {
			const preview = iframe.contentDocument;
			const body = preview?.body;
			const view = preview?.defaultView;
			if (!body || !view) return;

			if (!hasTitle && preview.title) iframe.title = preview.title;

			const resize = () => {
				// Ignore observations from a document the iframe has navigated away from.
				if (iframe.contentDocument !== preview) return;

				const marginBottom = parseFloat(
					view.getComputedStyle(body).marginBottom,
				);
				// scrollHeight is at least the viewport height, which prevents shrinking.
				// The body's bottom includes its top margin, padding, and content height.
				const height = Math.max(
					1,
					Math.ceil(
						body.getBoundingClientRect().bottom + view.scrollY + marginBottom,
					),
				);
				if (iframe.style.height !== `${height}px`) {
					iframe.style.height = `${height}px`;
				}
			};

			observer = new ResizeObserver(resize);
			observer.observe(body, { box: "border-box" });
			resize();
		} catch {
			// A redirect or sandbox can prevent access to an otherwise local preview.
			observer?.disconnect();
		}
	};

	iframe.addEventListener("load", fitPreview);
	fitPreview();
}
