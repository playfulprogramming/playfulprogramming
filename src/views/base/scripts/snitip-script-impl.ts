const postBodyEl = document.querySelector<HTMLElement>(".post-body")!;

interface SnitipElements {
	triggerEl: HTMLElement;
	triggerButtonEl: HTMLButtonElement;
	popoverEl: HTMLElement;
	popoverArrowEl: HTMLElement;
	closeEl: HTMLButtonElement;
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

function openSnitip(elements: SnitipElements) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore "source" is used for keyboard navigation: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/showPopover
	elements.popoverEl.showPopover({ source: elements.triggerButtonEl });
}

function closeSnitip(elements: SnitipElements) {
	console.trace("CLOSE");
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
		elements.closeEl.focus({ preventScroll: true });
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
		"#" + triggerEl.dataset.snitipTrigger,
	)!;
	const popoverArrowEl = popoverEl.querySelector<HTMLElement>("#snitip-arrow")!;
	const closeEl = popoverEl.querySelector<HTMLButtonElement>("#snitip-close")!;
	const snitipElements: SnitipElements = {
		triggerEl,
		triggerButtonEl,
		popoverEl,
		popoverArrowEl,
		closeEl,
	};

	triggerEl.addEventListener("mouseenter", () => {
		clearTimeout(mouseEnterTimeout);
		mouseEnterTimeout = setTimeout(() => {
			if (snitip) return;
			openSnitip(snitipElements);
			handleSnitipOpened(snitipElements, "mouse");
		}, 500);
	});

	triggerEl.addEventListener("mouseleave", () => {
		clearTimeout(mouseEnterTimeout);
	});

	triggerEl.addEventListener("click", () => {
		openSnitip(snitipElements);

		snitip = undefined;
		handleSnitipOpened(snitipElements, "focus");

		// Remove the mousemove listener so the snitip can no longer be dismissed by movement
		document.removeEventListener("mousemove", handleMouseMove);
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

	closeEl.addEventListener("click", () => closeSnitip(snitipElements));
}
