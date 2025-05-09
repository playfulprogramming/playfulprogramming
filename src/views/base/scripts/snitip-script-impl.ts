import { tabletLarge } from "src/tokens/breakpoints";

const popoverBreakpoint = window.matchMedia(
	`screen and (min-width: ${tabletLarge + 1}px)`,
);

const postBodyEl = document.querySelector<HTMLElement>(".post-body")!;

interface SnitipElements {
	triggerEl: HTMLElement;
	triggerButtonEl: HTMLButtonElement;
	popoverEl: HTMLElement;
	popoverArrowEl: HTMLElement;
	popoverCloseEl: HTMLButtonElement;
	dialogEl: HTMLDialogElement;
}

let snitip: SnitipElements | undefined;

let scrollTimeout: NodeJS.Timeout;
function handleScroll() {
	clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(positionSnitip, 20);
}

function positionSnitip() {
	if (!snitip) return;

	const snitipTriggerRect = snitip.triggerEl.getBoundingClientRect();
	const triggerCenter =
		snitip.triggerEl.offsetLeft + snitip.triggerEl.offsetWidth / 2;

	const postBodyRect = postBodyEl.getBoundingClientRect();

	const snitipRect = snitip.popoverEl.getBoundingClientRect();
	const minLeft = 0;
	const maxLeft = postBodyRect.right - snitipRect.width;

	const left = Math.max(
		minLeft,
		Math.min(maxLeft, triggerCenter - snitipRect.width / 2),
	);

	const isCloseToBottom =
		snitipTriggerRect.bottom + 20 + snitipRect.height > window.innerHeight;
	const top = isCloseToBottom
		? snitip.triggerEl.offsetTop - 20 - snitipRect.height
		: snitip.triggerEl.offsetTop + snitip.triggerEl.offsetHeight + 20;

	snitip.popoverEl.style.top = `${top}px`;
	snitip.popoverEl.style.left = `${left}px`;
	snitip.popoverArrowEl.style.left = `${triggerCenter - left}px`;
	snitip.popoverArrowEl.dataset.placement = isCloseToBottom ? "top" : "bottom";
}

function openSnitip(
	elements: SnitipElements,
	source: "mouse" | "focus" | "click",
) {
	// If the popover breakpoint is valid, open it
	if (popoverBreakpoint.matches) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore "source" is used for keyboard navigation: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/showPopover
		elements.popoverEl.showPopover({ source: elements.triggerButtonEl });
		handleSnitipOpened(elements, source);
	} else if (source != "mouse") {
		// Otherwise, show the snitip modal instead
		elements.dialogEl.showModal();
	}
}

function closeSnitip(elements: SnitipElements) {
	elements.popoverEl.hidePopover();
	handleSnitipClosed(elements);
}

function handleSnitipOpened(
	elements: SnitipElements,
	source: "mouse" | "focus" | "click",
) {
	if (snitip === elements) {
		positionSnitip();
		return;
	}

	if (snitip && snitip !== elements) {
		closeSnitip(snitip);
	}

	snitip = elements;
	positionSnitip();

	document.addEventListener("scroll", handleScroll, { passive: true });
	window.addEventListener("resize", positionSnitip, { passive: true });
	document.addEventListener("focusout", handleFocusOut);

	// If the snitip is opened by mouseover, then close it if the mouse leaves the area
	if (source === "mouse") {
		document.addEventListener("mousemove", handleMouseMove);
	}

	if (source === "focus") {
		elements.popoverCloseEl.focus({ preventScroll: true });
	}
}

function handleSnitipClosed(elements: SnitipElements) {
	if (snitip === elements) {
		snitip = undefined;
		document.removeEventListener("scroll", handleScroll);
		window.removeEventListener("resize", positionSnitip);
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("focusout", handleFocusOut);
	}
}

popoverBreakpoint.addEventListener("change", () => {
	if (popoverBreakpoint.matches) {
		// If a snitip dialog is open, close it!
		document
			.querySelector<HTMLDialogElement>("dialog[open][id^=snitip-dialog]")
			?.close();
	} else {
		// If there is a snitip popup visible, close it!
		if (snitip) closeSnitip(snitip);
	}
});

const POPOVER_BOX_EXPAND_PX = 20;

function handleMouseMove(e: MouseEvent) {
	if (!snitip) return;

	const isInside = isInsideSnitip(e.x, e.y, snitip);
	const isFocus = snitip.popoverEl.contains(document.activeElement);

	if (!isInside && !isFocus) closeSnitip(snitip);
}

function handleFocusOut() {
	// setTimeout ensures that activeElement is changed
	setTimeout(() => {
		// If the focused element is outside of the snitip, close it!
		const isBody = document.activeElement == document.body;
		const isFocus = snitip?.popoverEl.contains(document.activeElement);
		const isTriggerFocus = snitip?.triggerEl?.matches(":active");
		if (!isBody && !isFocus && !isTriggerFocus && snitip) closeSnitip(snitip);
	}, 0);
}

function isInsideSnitip(
	mouseX: number,
	mouseY: number,
	elements: SnitipElements,
): boolean {
	const triggerBox = elements.triggerEl.getBoundingClientRect();
	const popoverBoxInitial = elements.popoverEl.getBoundingClientRect();
	const popoverBox = new DOMRect(
		popoverBoxInitial.x - POPOVER_BOX_EXPAND_PX,
		popoverBoxInitial.y - POPOVER_BOX_EXPAND_PX,
		popoverBoxInitial.width + POPOVER_BOX_EXPAND_PX * 2,
		popoverBoxInitial.height + POPOVER_BOX_EXPAND_PX * 2,
	);

	let isTrapezoid: boolean;
	if (popoverBox.top > triggerBox.top) {
		// if the popover is below the trigger element
		isTrapezoid = isInsideTrapezoid(
			mouseX,
			mouseY,
			triggerBox.left,
			triggerBox.top,
			triggerBox.right,
			popoverBox.left,
			popoverBox.top,
			popoverBox.right,
		);
	} else {
		isTrapezoid = isInsideTrapezoid(
			mouseX,
			mouseY,
			triggerBox.left,
			triggerBox.bottom,
			triggerBox.right,
			popoverBox.left,
			popoverBox.bottom,
			popoverBox.right,
		);
	}

	const isHover =
		mouseX > popoverBox.left &&
		mouseX < popoverBox.right &&
		mouseY > popoverBox.top &&
		mouseY < popoverBox.bottom;
	return isTrapezoid || isHover;
}

/**
 * Assumptions:
 * - The trapezoid has horizontal top/bottom sides
 */
function isInsideTrapezoid(
	mouseX: number,
	mouseY: number,
	topLeft: number,
	top: number,
	topRight: number,
	bottomLeft: number,
	bottom: number,
	bottomRight: number,
) {
	if (mouseY > Math.max(top, bottom)) return false;
	if (mouseY < Math.min(top, bottom)) return false;

	const mouseHeight = Math.abs(mouseY - top) / Math.abs(bottom - top);
	const left = topLeft + (bottomLeft - topLeft) * mouseHeight;
	const right = topRight + (bottomRight - topRight) * mouseHeight;
	if (mouseX > Math.max(left, right)) return false;
	if (mouseX < Math.min(left, right)) return false;

	return true;
}

const triggerEls = Array.from(
	document.querySelectorAll<HTMLButtonElement>("[data-snitip-trigger]"),
);

let mouseEnterTimeout: NodeJS.Timeout;

for (const triggerEl of triggerEls) {
	const triggerButtonEl = triggerEl.querySelector<HTMLButtonElement>(
		"button[popovertarget]",
	)!;
	const popoverEl = document.querySelector<HTMLElement>(
		"#snitip-popover-" + triggerEl.dataset.snitipTrigger,
	)!;
	const popoverArrowEl = popoverEl.querySelector<HTMLElement>("#snitip-arrow")!;
	const popoverCloseEl =
		popoverEl.querySelector<HTMLButtonElement>("#snitip-close")!;
	const dialogEl = document.querySelector<HTMLDialogElement>(
		"#snitip-dialog-" + triggerEl.dataset.snitipTrigger,
	)!;
	const dialogFormEl = dialogEl.querySelector("form")!;
	const snitipElements: SnitipElements = {
		triggerEl,
		triggerButtonEl,
		popoverEl,
		popoverArrowEl,
		popoverCloseEl,
		dialogEl,
	};

	triggerEl.addEventListener("mouseenter", () => {
		clearTimeout(mouseEnterTimeout);
		mouseEnterTimeout = setTimeout(() => {
			if (snitip) return;
			openSnitip(snitipElements, "mouse");
		}, 500);
	});

	triggerEl.addEventListener("mouseleave", () => {
		clearTimeout(mouseEnterTimeout);
	});

	triggerEl.addEventListener("click", () => {
		snitip = undefined;
		openSnitip(snitipElements, "focus");

		// Remove the mousemove listener so the snitip can no longer be dismissed by movement
		document.removeEventListener("mousemove", handleMouseMove);
	});

	popoverEl.addEventListener("beforetoggle", (e) => {
		const event = e as ToggleEvent;
		// Prevent the popover from being opened when the breakpoint doesn't match
		if (
			event.newState == "open" &&
			event.cancelable &&
			!popoverBreakpoint.matches
		) {
			event.preventDefault();
		}
	});

	popoverEl.addEventListener("toggle", (e) => {
		const event = e as ToggleEvent;
		triggerEl.dataset.snitipTriggerState = event.newState;
		if (event.newState == "open") {
			handleSnitipOpened(snitipElements, "focus");
		} else if (event.newState == "closed" && event.oldState != "closed") {
			popoverEl.popover = "auto";
			handleSnitipClosed(snitipElements);
		}
	});

	popoverCloseEl.addEventListener("click", () => closeSnitip(snitipElements));

	// If the closedBy attribute isn't supported, we need to manually handle a light dismiss action
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore Missing DOM types
	if (typeof dialogEl.closedBy == "undefined") {
		dialogEl.addEventListener("click", (e) => {
			// If the dialog backdrop is clicked, close it!
			if (e.target == dialogEl) {
				dialogEl.close();
			}
		});
	}

	// Set [data-scrolled=true] if the dialog is scrolled so that the sticky heading border can show
	function handleDialogScroll() {
		dialogEl.dataset.scrolled = String(dialogFormEl.scrollTop > 0);
	}

	dialogFormEl.addEventListener("scroll", handleDialogScroll, {
		passive: true,
	});
	window.addEventListener("resize", handleDialogScroll, { passive: true });
}
