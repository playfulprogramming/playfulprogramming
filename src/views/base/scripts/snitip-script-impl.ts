import { tabletLarge } from "#src/tokens/breakpoints.ts";

const anchoredDialogBreakpoint = window.matchMedia(
	`screen and (min-width: ${tabletLarge + 1}px)`,
);
const hoverDialogPointer = window.matchMedia(
	`screen and (min-width: ${tabletLarge + 1}px) and (hover: hover) and (pointer: fine)`,
);

const HOVER_OPEN_DELAY_MS = 500;
const HOVER_BOX_EXPAND_PX = 20;

interface SnitipElements {
	triggerEl: HTMLElement;
	triggerButtonEl: HTMLButtonElement;
	dialogEl: HTMLDialogElement;
	dialogFormEl: HTMLFormElement;
	dialogArrowEl: SVGElement;
	dialogCloseEl: HTMLButtonElement;
}

let activeSnitip: SnitipElements | undefined;
let activeOpenSource: "activation" | "hover" | undefined;
let positionFrame: number | undefined;
let hoverOpenTimeout: ReturnType<typeof setTimeout> | undefined;

function setTriggerExpanded(elements: SnitipElements, expanded: boolean) {
	elements.triggerButtonEl.setAttribute("aria-expanded", String(expanded));
}

function resetDialogPosition(elements: SnitipElements) {
	elements.dialogEl.style.removeProperty("left");
	elements.dialogEl.style.removeProperty("top");
	elements.dialogArrowEl.style.removeProperty("left");
	elements.dialogArrowEl.dataset.placement = "bottom";
}

function positionSnitip() {
	positionFrame = undefined;
	if (!activeSnitip || !anchoredDialogBreakpoint.matches) return;

	const { dialogArrowEl, dialogEl, triggerEl } = activeSnitip;
	const triggerRect = triggerEl.getBoundingClientRect();
	const triggerCenter = triggerRect.left + triggerRect.width / 2;
	const contentRect = triggerEl
		.closest<HTMLElement>(".post-body")
		?.getBoundingClientRect();
	const dialogRect = dialogEl.getBoundingClientRect();

	const minLeft = Math.max(0, contentRect?.left ?? 0);
	const maxRight = Math.min(
		window.innerWidth,
		contentRect?.right ?? window.innerWidth,
	);
	const maxLeft = Math.max(minLeft, maxRight - dialogRect.width);
	const left = Math.max(
		minLeft,
		Math.min(maxLeft, triggerCenter - dialogRect.width / 2),
	);

	const gap = 20;
	const topBelow = triggerRect.bottom + gap;
	const topAbove = triggerRect.top - gap - dialogRect.height;
	const maxTop = Math.max(0, window.innerHeight - dialogRect.height);
	const opensAbove = topBelow + dialogRect.height > window.innerHeight;
	const top = Math.max(0, Math.min(maxTop, opensAbove ? topAbove : topBelow));
	const arrowLeft = Math.max(
		12,
		Math.min(dialogRect.width - 12, triggerCenter - left),
	);

	dialogEl.style.left = `${left}px`;
	dialogEl.style.top = `${top}px`;
	dialogArrowEl.style.left = `${arrowLeft}px`;
	dialogArrowEl.dataset.placement = opensAbove ? "top" : "bottom";
}

function schedulePositionSnitip() {
	if (positionFrame !== undefined) cancelAnimationFrame(positionFrame);
	positionFrame = requestAnimationFrame(positionSnitip);
}

function updateDialogPresentation(elements: SnitipElements) {
	if (anchoredDialogBreakpoint.matches) {
		elements.dialogEl.dataset.presentation = "anchored";
		schedulePositionSnitip();
	} else {
		elements.dialogEl.dataset.presentation = "centered";
		resetDialogPosition(elements);
	}
}

function prepareSnitipClose(elements: SnitipElements) {
	setTriggerExpanded(elements, false);
}

function promoteHoverToActivation(elements: SnitipElements) {
	activeOpenSource = "activation";
	elements.dialogEl.dataset.openSource = "activation";
	stopHoverTracking();
	elements.dialogCloseEl.focus({ preventScroll: true });
}

function stopHoverTracking() {
	if (hoverOpenTimeout !== undefined) {
		clearTimeout(hoverOpenTimeout);
		hoverOpenTimeout = undefined;
	}
	document.removeEventListener("pointermove", handleHoverPointerMove);
}

function handleSnitipClosed(elements: SnitipElements) {
	const shouldRestoreFocus = activeSnitip === elements;
	prepareSnitipClose(elements);
	resetDialogPosition(elements);
	elements.dialogEl.removeAttribute("data-presentation");
	elements.dialogEl.removeAttribute("data-open-source");
	elements.dialogEl.dataset.scrolled = "false";

	if (shouldRestoreFocus) {
		activeSnitip = undefined;
		activeOpenSource = undefined;
		stopHoverTracking();
		window.removeEventListener("resize", schedulePositionSnitip);
		if (positionFrame !== undefined) {
			cancelAnimationFrame(positionFrame);
			positionFrame = undefined;
		}
	}

	// Native dialogs normally restore focus to the invoking control. Explicitly
	// doing so also covers older engines and makes the newly collapsed state the
	// screen reader's next announcement.
	if (shouldRestoreFocus) {
		requestAnimationFrame(() => {
			elements.triggerButtonEl.focus({ preventScroll: true });
		});
	}
}

function openSnitip(elements: SnitipElements, source: "activation" | "hover") {
	if (elements.dialogEl.open) {
		if (activeSnitip === elements && source === "activation") {
			promoteHoverToActivation(elements);
		}
		return;
	}

	if (activeSnitip?.dialogEl.open) {
		activeSnitip.dialogEl.close();
	}

	stopHoverTracking();
	activeSnitip = elements;
	activeOpenSource = source;
	elements.dialogEl.dataset.openSource = source;
	activeElementsByDialog.set(elements.dialogEl, elements);
	setTriggerExpanded(elements, true);
	elements.dialogEl.dataset.scrolled = "false";
	updateDialogPresentation(elements);

	try {
		elements.dialogEl.showModal();
	} catch (error) {
		handleSnitipClosed(elements);
		throw error;
	}

	window.addEventListener("resize", schedulePositionSnitip, { passive: true });
	if (anchoredDialogBreakpoint.matches) positionSnitip();
	elements.dialogCloseEl.focus({ preventScroll: true });
	if (source === "hover") {
		document.addEventListener("pointermove", handleHoverPointerMove, {
			passive: true,
		});
	}
}

anchoredDialogBreakpoint.addEventListener("change", () => {
	if (activeSnitip?.dialogEl.open) {
		updateDialogPresentation(activeSnitip);
	}
});

hoverDialogPointer.addEventListener("change", () => {
	if (hoverDialogPointer.matches) return;
	stopHoverTracking();
	if (activeOpenSource === "hover") activeSnitip?.dialogEl.close();
});

function isInsideRect(x: number, y: number, rect: DOMRect) {
	return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function isInsideTrapezoid(
	x: number,
	y: number,
	topLeft: number,
	top: number,
	topRight: number,
	bottomLeft: number,
	bottom: number,
	bottomRight: number,
) {
	if (y > Math.max(top, bottom) || y < Math.min(top, bottom)) return false;

	const height = Math.abs(bottom - top);
	if (height === 0) return false;
	const progress = Math.abs(y - top) / height;
	const left = topLeft + (bottomLeft - topLeft) * progress;
	const right = topRight + (bottomRight - topRight) * progress;
	return x >= Math.min(left, right) && x <= Math.max(left, right);
}

function isInsideHoverArea(x: number, y: number, elements: SnitipElements) {
	const triggerRect = elements.triggerEl.getBoundingClientRect();
	const dialogRectInitial = elements.dialogEl.getBoundingClientRect();
	const dialogRect = new DOMRect(
		dialogRectInitial.x - HOVER_BOX_EXPAND_PX,
		dialogRectInitial.y - HOVER_BOX_EXPAND_PX,
		dialogRectInitial.width + HOVER_BOX_EXPAND_PX * 2,
		dialogRectInitial.height + HOVER_BOX_EXPAND_PX * 2,
	);
	if (isInsideRect(x, y, triggerRect) || isInsideRect(x, y, dialogRect)) {
		return true;
	}

	if (dialogRectInitial.top > triggerRect.bottom) {
		return isInsideTrapezoid(
			x,
			y,
			triggerRect.left,
			triggerRect.bottom,
			triggerRect.right,
			dialogRect.left,
			dialogRect.top,
			dialogRect.right,
		);
	}

	return isInsideTrapezoid(
		x,
		y,
		dialogRect.left,
		dialogRect.bottom,
		dialogRect.right,
		triggerRect.left,
		triggerRect.top,
		triggerRect.right,
	);
}

function handleHoverPointerMove(event: PointerEvent) {
	if (
		activeOpenSource !== "hover" ||
		!activeSnitip ||
		isInsideHoverArea(event.clientX, event.clientY, activeSnitip)
	) {
		return;
	}

	activeSnitip.dialogEl.close();
}

const initializedDialogs = new WeakSet<HTMLDialogElement>();
const activeElementsByDialog = new WeakMap<HTMLDialogElement, SnitipElements>();

function handleDialogTab(event: KeyboardEvent, dialogEl: HTMLDialogElement) {
	if (event.key !== "Tab" || !dialogEl.open) return;

	const focusableEls = Array.from(
		dialogEl.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
		),
	).filter(
		(element) =>
			element.tabIndex >= 0 &&
			!element.hidden &&
			getComputedStyle(element).visibility !== "hidden" &&
			element.getClientRects().length > 0,
	);
	const firstFocusableEl = focusableEls.at(0);
	const lastFocusableEl = focusableEls.at(-1);
	event.preventDefault();
	if (!firstFocusableEl || !lastFocusableEl) {
		dialogEl.focus();
		return;
	}

	const activeIndex = focusableEls.indexOf(
		document.activeElement as HTMLElement,
	);
	const nextIndex = event.shiftKey
		? activeIndex <= 0
			? focusableEls.length - 1
			: activeIndex - 1
		: activeIndex < 0 || activeIndex === focusableEls.length - 1
			? 0
			: activeIndex + 1;
	focusableEls[nextIndex].focus();
}

function initializeDialog(elements: SnitipElements) {
	const { dialogCloseEl, dialogEl, dialogFormEl } = elements;
	activeElementsByDialog.set(dialogEl, elements);
	if (initializedDialogs.has(dialogEl)) return;
	initializedDialogs.add(dialogEl);

	// Native modal dialog backdrops make the invoking button inert. Handle the
	// pointer sequence ourselves so clicking the still-hovered trigger can pin
	// the dialog open instead of being mistaken for a light-dismiss gesture.
	let pointerStartedOutside = false;
	let pointerStartedOverTrigger = false;
	let activePointerId: number | undefined;
	const isOutsideDialogCard = (event: PointerEvent) => {
		const rect = dialogFormEl.getBoundingClientRect();
		return (
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom
		);
	};

	dialogEl.addEventListener("pointerdown", (event) => {
		pointerStartedOutside = isOutsideDialogCard(event);
		activePointerId = event.pointerId;
		const currentElements = activeElementsByDialog.get(dialogEl);
		pointerStartedOverTrigger = Boolean(
			currentElements &&
			isInsideRect(
				event.clientX,
				event.clientY,
				currentElements.triggerEl.getBoundingClientRect(),
			),
		);
	});
	dialogEl.addEventListener("pointerup", (event) => {
		if (
			activePointerId === event.pointerId &&
			pointerStartedOutside &&
			isOutsideDialogCard(event)
		) {
			const currentElements = activeElementsByDialog.get(dialogEl);
			const isOverTrigger = Boolean(
				currentElements &&
				isInsideRect(
					event.clientX,
					event.clientY,
					currentElements.triggerEl.getBoundingClientRect(),
				),
			);
			if (
				activeOpenSource === "hover" &&
				currentElements &&
				pointerStartedOverTrigger &&
				isOverTrigger
			) {
				promoteHoverToActivation(currentElements);
			} else {
				if (currentElements) prepareSnitipClose(currentElements);
				dialogEl.close();
			}
		}
		pointerStartedOutside = false;
		pointerStartedOverTrigger = false;
		activePointerId = undefined;
	});
	dialogEl.addEventListener("pointercancel", () => {
		pointerStartedOutside = false;
		pointerStartedOverTrigger = false;
		activePointerId = undefined;
	});

	dialogCloseEl.addEventListener("click", () => {
		const currentElements = activeElementsByDialog.get(dialogEl);
		if (currentElements) prepareSnitipClose(currentElements);
	});
	dialogEl.addEventListener("cancel", () => {
		const currentElements = activeElementsByDialog.get(dialogEl);
		if (currentElements) prepareSnitipClose(currentElements);
	});
	dialogEl.addEventListener("close", () => {
		const currentElements = activeElementsByDialog.get(dialogEl);
		if (currentElements) handleSnitipClosed(currentElements);
	});
	dialogEl.addEventListener("keydown", (event) =>
		handleDialogTab(event, dialogEl),
	);

	dialogFormEl.addEventListener(
		"scroll",
		() => {
			dialogEl.dataset.scrolled = String(dialogFormEl.scrollTop > 0);
		},
		{ passive: true },
	);
}

const triggerEls = document.querySelectorAll<HTMLElement>(
	"[data-snitip-trigger]",
);

for (const triggerEl of triggerEls) {
	if (triggerEl.dataset.snitipInitialized) continue;

	const triggerButtonEl = triggerEl.querySelector<HTMLButtonElement>(
		'button[aria-haspopup="dialog"]',
	);
	const dialogId = triggerEl.dataset.snitipDialog;
	const dialogEl = dialogId ? document.getElementById(dialogId) : null;
	if (!triggerButtonEl || !(dialogEl instanceof HTMLDialogElement)) continue;

	const dialogFormEl = dialogEl.querySelector<HTMLFormElement>("form");
	const dialogArrowEl = dialogEl.querySelector<SVGElement>(
		"[data-snitip-arrow]",
	);
	const dialogCloseEl = dialogEl.querySelector<HTMLButtonElement>(
		"[data-snitip-close]",
	);
	if (!dialogFormEl || !dialogArrowEl || !dialogCloseEl) {
		continue;
	}

	const elements: SnitipElements = {
		triggerEl,
		triggerButtonEl,
		dialogEl,
		dialogFormEl,
		dialogArrowEl,
		dialogCloseEl,
	};

	triggerEl.dataset.snitipInitialized = "true";
	initializeDialog(elements);
	triggerEl.addEventListener("pointerenter", (event) => {
		if (
			event.pointerType !== "mouse" ||
			!hoverDialogPointer.matches ||
			activeSnitip?.dialogEl.open
		) {
			return;
		}

		if (hoverOpenTimeout !== undefined) clearTimeout(hoverOpenTimeout);
		hoverOpenTimeout = setTimeout(() => {
			hoverOpenTimeout = undefined;
			if (hoverDialogPointer.matches && triggerEl.matches(":hover")) {
				openSnitip(elements, "hover");
			}
		}, HOVER_OPEN_DELAY_MS);
	});
	triggerEl.addEventListener("pointerleave", () => {
		if (hoverOpenTimeout !== undefined) {
			clearTimeout(hoverOpenTimeout);
			hoverOpenTimeout = undefined;
		}
	});
	triggerButtonEl.addEventListener("pointerdown", stopHoverTracking);
	triggerButtonEl.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") stopHoverTracking();
	});
	triggerButtonEl.addEventListener("click", () => {
		stopHoverTracking();
		openSnitip(elements, "activation");
	});
}
