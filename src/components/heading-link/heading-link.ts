import { m } from "#src/paraglide/messages.js";

/** Attach permalink controls to the article headings currently in the DOM. */
export function initializeHeadingLinks(root: ParentNode = document) {
	const template = root.querySelector<HTMLTemplateElement>(
		"#heading-link-template",
	);
	if (!template) return;

	function handleClick(event: Event) {
		// Links nested inside a heading retain their usual navigation behavior.
		if ((event.target as Element).closest("a")) return;

		const heading = event.currentTarget as HTMLElement;
		const anchor = heading.querySelector<HTMLElement>("[data-heading-anchor]");
		const href = anchor?.getAttribute("data-heading-href");
		if (!anchor || !href) return;
		navigator.clipboard.writeText(href);

		const copy = anchor.querySelector<HTMLElement>(
			"[data-heading-link='copy']",
		)!;
		const copied = anchor.querySelector<HTMLElement>(
			"[data-heading-link='copied']",
		)!;
		anchor.setAttribute("data-heading-anchor", "copied");
		copy.hidden = true;
		copied.hidden = false;

		setTimeout(() => {
			anchor.setAttribute("data-heading-anchor", "copy");
			copy.hidden = false;
			copied.hidden = true;
		}, 1000);

		event.preventDefault();
	}

	for (const heading of root.querySelectorAll<HTMLElement>(
		".post-body :is(h1, h2, h3, h4, h5, h6)[id]:not([data-no-heading-link])",
	)) {
		if (heading.querySelector("[data-heading-anchor]")) continue;

		const clone = template.content.cloneNode(true) as DocumentFragment;
		const anchor = clone.querySelector("button")!;
		const href = new URL(`#${heading.id}`, location.href);
		anchor.setAttribute("data-heading-href", href.toString());
		anchor.setAttribute(
			"aria-label",
			m.label_copy_permalink_for({ heading: heading.innerText }),
		);

		// Handle the button's bubbling click here as well, so one activation copies once.
		heading.addEventListener("click", handleClick);
		heading.classList.add("heading-linked");
		heading.appendChild(clone);
	}
}
