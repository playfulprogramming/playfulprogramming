import { Element, Root } from "hast";
import { fromHtml } from "hast-util-from-html";
import { find } from "unist-util-find";

const pageHtmlMap = new Map<string, Promise<Root | null>>();

export function fetchPageHtml(src: string): Promise<Root | null> {
	if (pageHtmlMap.has(src)) return pageHtmlMap.get(src)!;

	const promise = (async () => {
		const srcHTML = await fetch(src)
			.then((r) => (r.status === 200 ? r.text() : undefined))
			.catch(() => null);

		// if fetch fails...
		if (!srcHTML) return null;

		const srcHast = fromHtml(srcHTML);

		return srcHast;
	})();

	pageHtmlMap.set(src, promise);
	return promise;
}

export function getPageTitle(srcHast: Root) {
	// find <title> element in response HTML
	const titleEl = find<Element>(srcHast, { tagName: "title" });
	const titleContentEl = titleEl && titleEl.children[0];
	const title =
		titleContentEl?.type === "text" ? titleContentEl.value : undefined;

	return title;
}

export function escapeHtml(unsafe: string) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
