const postBodyEl = document.querySelector<HTMLElement>(".post-body")!;

interface SnitipElements {
	triggerEl: HTMLElement;
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
	elements.popoverEl.showPopover({ source: elements.triggerEl });
}

function closeSnitip() {
	snitip?.popoverEl?.hidePopover();
	snitip = undefined;

	handleSnitipClosed();
}

function handleSnitipOpened(
	elements: SnitipElements,
	source: "mouseover" | "keydown",
) {
	if (snitip === elements) {
		positionSnitip();
		return;
	}
	snitip = elements;
	positionSnitip();

	document.addEventListener("scroll", handleScroll, { passive: true });
	window.addEventListener("resize", positionSnitip, { passive: true });
	document.addEventListener("focusout", handleFocusOut);

	// If the snitip is opened by mouseover, then close it if the mouse leaves the area
	if (source === "mouseover") {
		document.addEventListener("mousemove", handleMouseMove);
	}

	if (source === "keydown") {
		elements.closeEl.focus({ preventScroll: true });
	}
}

function handleSnitipClosed() {
	snitip = undefined;
	document.removeEventListener("scroll", handleScroll);
	window.removeEventListener("resize", positionSnitip);
	document.removeEventListener("mousemove", handleMouseMove);
}

function handleMouseMove(e: MouseEvent) {
	if (!snitip) return;

	const triggerBox = snitip.triggerEl.getBoundingClientRect();
	const popoverBox = snitip.popoverEl.getBoundingClientRect();

	let isTrapezoid: boolean;
	if (popoverBox.top > triggerBox.top) {
		// if the popover is below the trigger element
		isTrapezoid = isInsideTrapezoid(
			e.x,
			e.y,
			triggerBox.left,
			triggerBox.top,
			triggerBox.right,
			popoverBox.left,
			popoverBox.top,
			popoverBox.right,
		);
	} else {
		isTrapezoid = isInsideTrapezoid(
			e.x,
			e.y,
			triggerBox.left,
			triggerBox.bottom,
			triggerBox.right,
			popoverBox.left,
			popoverBox.bottom,
			popoverBox.right,
		);
	}

	const isHover = snitip.popoverEl.matches(":hover");
	const isFocus = snitip.popoverEl.contains(document.activeElement);

	if (!isTrapezoid && !isHover && !isFocus) closeSnitip();
}

function handleFocusOut() {
	// setTimeout ensures that activeElement is changed
	setTimeout(() => {
		// If the focused element is outside of the snitip, close it!
		const isFocus = snitip?.popoverEl.contains(document.activeElement);
		if (!isFocus) closeSnitip();
	}, 0);
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

for (const triggerEl of triggerEls) {
	const popoverEl = triggerEl.popoverTargetElement as HTMLElement;
	const popoverArrowEl = popoverEl.querySelector<HTMLElement>("#snitip-arrow")!;
	const closeEl = popoverEl.querySelector<HTMLButtonElement>("#snitip-close")!;
	const snitipElements: SnitipElements = {
		triggerEl,
		popoverEl,
		popoverArrowEl,
		closeEl,
	};

	/*triggerEl.addEventListener("mouseover", () => {
		openSnitip(snitipElements);
		handleSnitipOpened(snitipElements, "mouseover");
	});*/

	triggerEl.addEventListener("click", () => {
		// Rebind listeners for keydown (so that mousemove is unbound and the popup is focused)
		handleSnitipClosed();
		handleSnitipOpened(snitipElements, "keydown");
	});

	popoverEl.addEventListener("toggle", (e) => {
		const event = e as ToggleEvent;
		triggerEl.dataset.snitipTrigger = event.newState;
		if (event.newState == "open") {
			handleSnitipOpened(snitipElements, "keydown");
		} else {
			handleSnitipClosed();
		}
	});

	closeEl.addEventListener("click", closeSnitip);

	if (triggerEl.matches(":target")) {
		openSnitip(snitipElements);
	}
}
