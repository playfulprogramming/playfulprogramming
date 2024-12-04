import { SnitipMetadata } from "types/SnitipInfo";

const snitipTemplateEl =
	document.querySelector<HTMLTemplateElement>("#snitip-template")!;
const postBodyEl = document.querySelector<HTMLElement>(".post-body")!;

interface SnitipElements {
	triggerEl: HTMLElement;
	popoverEl: HTMLElement;
	popoverArrowEl: HTMLElement;
}

let snitip: SnitipElements | undefined;

function bindSnitip(template: HTMLElement, snitip: SnitipMetadata) {
	const titleEl = template.querySelector<HTMLElement>("#snitip-title")!;
	const bodyEl = template.querySelector<HTMLElement>("#snitip-body")!;
	const linksEl = template.querySelector<HTMLElement>("#snitip-links")!;

	titleEl.innerText = snitip.title;
	bodyEl.innerHTML = snitip.content;

	for (const link of snitip.links) {
		const linkTemplate = document.querySelector<HTMLTemplateElement>(
			"#snitip-link-template",
		)!;
		const linkEl = linkTemplate.content.cloneNode(true).firstChild!;
		const anchorEl = (linkEl as HTMLElement).querySelector<HTMLAnchorElement>(
			"#snitip-link",
		)!;

		anchorEl.href = link.href;
		anchorEl.innerText = link.name;

		linksEl.appendChild(linkEl);
	}
}

function positionSnitip() {
	if (!snitip) return;

	const snitipTriggerRect = snitip.triggerEl.getBoundingClientRect();
	const triggerCenter = snitipTriggerRect.left + snitipTriggerRect.width / 2;

	const postBodyRect = postBodyEl.getBoundingClientRect();

	const snitipRect = snitip.popoverEl.getBoundingClientRect();
	const minLeft = 0;
	const maxLeft = postBodyRect.right - snitipRect.width;

	const top = snitipTriggerRect.top + snitipTriggerRect.height + 20;
	const left = Math.max(
		minLeft,
		Math.min(maxLeft, triggerCenter - snitipRect.width / 2),
	);
	snitip.popoverEl.style.top = `${top}px`;
	snitip.popoverEl.style.left = `${left}px`;
	snitip.popoverArrowEl.style.left = `${triggerCenter - left}px`;
}

function openSnitip(elements: SnitipElements) {
	snitip = elements;
	snitip.popoverEl.showPopover();
	positionSnitip();

	document.addEventListener("scroll", positionSnitip);
	document.addEventListener("resize", positionSnitip);
}

function closeSnitip() {
	snitip?.popoverEl?.hidePopover();
	snitip = undefined;

	document.removeEventListener("scroll", positionSnitip);
	document.removeEventListener("resize", positionSnitip);
}

document.addEventListener("mousedown", (e) => {
	if (snitip && snitip.popoverEl.contains(e.target as HTMLElement)) {
		return;
	}
	closeSnitip();
});

const triggerEls = Array.from(
	document.querySelectorAll<HTMLElement>("[data-snitip]"),
);

for (const triggerEl of triggerEls) {
	const explicitSnitipBtn = triggerEl.querySelector(
		`[role="button"]`,
	) as HTMLElement;

	let popoverEl: HTMLElement | null = null;
	let popoverArrowEl: HTMLElement | null = null;

	// eslint-disable-next-line no-inner-declarations
	function show() {
		if (!popoverEl || !popoverArrowEl) {
			const popover = snitipTemplateEl.content.cloneNode(true)
				.firstChild as HTMLElement;
			const snitipMetadata = JSON.parse(
				triggerEl.dataset.snitip + "",
			) as SnitipMetadata;
			bindSnitip(popover, snitipMetadata);

			document.body.appendChild(popover);
			popoverEl = popover;
			popoverArrowEl = popover.querySelector("#snitip-arrow")!;
		}

		openSnitip({ triggerEl, popoverEl, popoverArrowEl });
	}

	triggerEl.addEventListener("mouseover", show);
	triggerEl.addEventListener("mouseout", closeSnitip);

	explicitSnitipBtn.addEventListener("keydown", (e) => {
		if (e.code === "Enter" || e.code === "Space") {
			e.preventDefault();
			show();
		}
	});
}
