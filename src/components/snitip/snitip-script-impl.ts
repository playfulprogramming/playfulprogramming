import { tabletLarge } from "#src/constants/breakpoints.ts";

const anchoredDialogBreakpoint =
	typeof window === "undefined"
		? undefined
		: window.matchMedia(`screen and (min-width: ${tabletLarge + 1}px)`);
const hoverDialogPointer =
	typeof window === "undefined"
		? undefined
		: window.matchMedia(
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
	dialogTitleEl: HTMLElement;
}

let snitip: SnitipElements | undefined;
let activeOpenSource: "activation" | "hover" | undefined;
let mouseEnterTimeout: ReturnType<typeof setTimeout> | undefined;
let pendingHover: SnitipElements | undefined;
let hoverPreviousFocus: HTMLElement | undefined;
let pendingFocusRestore:
	| { elements: SnitipElements; frame: number }
	| undefined;

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
	if (!snitip || !anchoredDialogBreakpoint?.matches) return;

	const { dialogArrowEl, dialogEl, triggerEl } = snitip;
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

function promoteHoverToActivation(
	elements: SnitipElements,
	{ focusTitle = false, focusTitleVisible = false } = {},
) {
	activeOpenSource = "activation";
	hoverPreviousFocus = undefined;
	stopHoverTracking();
	if (focusTitle) {
		elements.dialogEl.dataset.titleFocusVisible = String(focusTitleVisible);
		elements.dialogTitleEl.focus({
			preventScroll: true,
			focusVisible: focusTitleVisible,
		});
	}
}

function stopHoverTracking() {
	if (mouseEnterTimeout !== undefined) {
		clearTimeout(mouseEnterTimeout);
		mouseEnterTimeout = undefined;
	}
	pendingHover = undefined;
	document.removeEventListener("pointermove", handleMouseMove);
}

function prepareSnitipClose(elements: SnitipElements) {
	setTriggerExpanded(elements, false);
}

function closeSnitip(elements: SnitipElements) {
	prepareSnitipClose(elements);
	elements.dialogEl.close();
}

function handleSnitipClosed(elements: SnitipElements, restoreFocus = true) {
	const shouldRestoreFocus = snitip === elements;
	setTriggerExpanded(elements, false);
	resetDialogPosition(elements);
	elements.dialogEl.dataset.scrolled = "false";
	delete elements.dialogEl.dataset.titleFocusVisible;
	if (!shouldRestoreFocus) return;

	const closedSource = activeOpenSource;
	const previousFocus = hoverPreviousFocus;
	snitip = undefined;
	activeOpenSource = undefined;
	hoverPreviousFocus = undefined;
	stopHoverTracking();
	window.removeEventListener("resize", positionSnitip);
	if (!restoreFocus) return;
	const focusAfterClose = document.activeElement;
	// Native closing may already have let the user focus another control.
	if (
		focusAfterClose !== document.body &&
		focusAfterClose !== elements.triggerButtonEl &&
		!elements.dialogEl.contains(focusAfterClose)
	)
		return;

	if (pendingFocusRestore) cancelAnimationFrame(pendingFocusRestore.frame);
	pendingFocusRestore = {
		elements,
		frame: requestAnimationFrame(() => {
			pendingFocusRestore = undefined;
			if (document.activeElement !== focusAfterClose) return;
			if (closedSource === "activation") {
				elements.triggerButtonEl.focus({ preventScroll: true });
			} else if (previousFocus?.isConnected) {
				previousFocus.focus({ preventScroll: true });
			} else if (document.activeElement === elements.triggerButtonEl) {
				elements.triggerButtonEl.blur();
			}
		}),
	};
}

function openSnitip(
	elements: SnitipElements,
	source: "activation" | "hover",
	focusTitleVisible = false,
) {
	if (elements.dialogEl.open) {
		if (snitip === elements && source === "activation") {
			promoteHoverToActivation(elements, {
				focusTitle: true,
				focusTitleVisible,
			});
		}
		return;
	}

	if (snitip?.dialogEl.open) {
		closeSnitip(snitip);
	} else if (snitip) {
		// A native close event may still be queued when another reference opens.
		setTriggerExpanded(snitip, false);
	}
	if (pendingFocusRestore) {
		cancelAnimationFrame(pendingFocusRestore.frame);
		pendingFocusRestore = undefined;
	}

	stopHoverTracking();
	snitip = elements;
	activeOpenSource = source;
	hoverPreviousFocus =
		source === "hover" &&
		document.activeElement instanceof HTMLElement &&
		document.activeElement !== document.body
			? document.activeElement
			: undefined;
	activeElementsByDialog.set(elements.dialogEl, elements);
	setTriggerExpanded(elements, true);
	elements.dialogEl.dataset.scrolled = "false";
	elements.dialogEl.dataset.titleFocusVisible = String(focusTitleVisible);
	if (!anchoredDialogBreakpoint?.matches) resetDialogPosition(elements);

	try {
		elements.dialogEl.showModal();
	} catch (error) {
		handleSnitipClosed(elements);
		throw error;
	}

	window.addEventListener("resize", positionSnitip, { passive: true });
	if (anchoredDialogBreakpoint?.matches) positionSnitip();
	elements.dialogTitleEl.focus({
		preventScroll: true,
		focusVisible: focusTitleVisible,
	});
	if (source === "hover") {
		document.addEventListener("pointermove", handleMouseMove, {
			passive: true,
		});
	}
}

anchoredDialogBreakpoint?.addEventListener("change", () => {
	if (snitip?.dialogEl.open) {
		if (anchoredDialogBreakpoint.matches) positionSnitip();
		else resetDialogPosition(snitip);
	}
});

hoverDialogPointer?.addEventListener("change", () => {
	if (hoverDialogPointer.matches) return;
	stopHoverTracking();
	if (activeOpenSource === "hover" && snitip) closeSnitip(snitip);
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

function isInsideSnitip(x: number, y: number, elements: SnitipElements) {
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

function handleMouseMove(event: PointerEvent) {
	if (
		activeOpenSource !== "hover" ||
		!snitip ||
		isInsideSnitip(event.clientX, event.clientY, snitip)
	) {
		return;
	}

	closeSnitip(snitip);
}

const initializedDialogs = new WeakMap<
	HTMLDialogElement,
	{ references: number; cleanup: () => void }
>();
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
		dialogEl
			.querySelector<HTMLElement>("[data-snitip-title]")
			?.focus({ focusVisible: true });
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
	focusableEls[nextIndex].focus({ focusVisible: true });
}

function initializeDialog(elements: SnitipElements) {
	const { dialogEl, dialogFormEl } = elements;
	const existing = initializedDialogs.get(dialogEl);
	if (existing) {
		existing.references += 1;
		return;
	}
	const controller = new AbortController();
	const options = { signal: controller.signal };
	const originalParent = dialogEl.parentNode;
	const originalNextSibling = dialogEl.nextSibling;
	initializedDialogs.set(dialogEl, {
		references: 1,
		cleanup() {
			controller.abort();
			activeElementsByDialog.delete(dialogEl);
			if (originalParent && dialogEl.parentNode !== originalParent) {
				originalParent.insertBefore(
					dialogEl,
					originalNextSibling?.parentNode === originalParent
						? originalNextSibling
						: null,
				);
			}
		},
	});

	// `showModal()` moves the dialog into the top layer visually, but it does
	// not change its DOM or accessibility-tree ancestry. Keep the modal outside
	// named content landmarks so assistive technology cannot navigate from the
	// dialog into an otherwise inert ancestor region.
	if (dialogEl.parentElement !== document.body) document.body.append(dialogEl);

	// Native modal dialog backdrops make the invoking button inert. Handle the
	// pointer sequence ourselves so clicking the still-hovered trigger can pin
	// the dialog open instead of being mistaken for a light-dismiss gesture.
	const isOutsideDialogCard = (event: PointerEvent) => {
		const rect = dialogFormEl.getBoundingClientRect();
		return (
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom
		);
	};
	const isOverTrigger = (
		event: PointerEvent,
		currentElements: SnitipElements | undefined,
	) =>
		Boolean(
			currentElements &&
			isInsideRect(
				event.clientX,
				event.clientY,
				currentElements.triggerEl.getBoundingClientRect(),
			),
		);
	let pointerStart: { id: number; overTrigger: boolean } | undefined;

	dialogEl.addEventListener(
		"pointerdown",
		(event) => {
			if (!isOutsideDialogCard(event)) {
				pointerStart = undefined;
				return;
			}
			const currentElements = activeElementsByDialog.get(dialogEl);
			pointerStart = {
				id: event.pointerId,
				overTrigger: isOverTrigger(event, currentElements),
			};
		},
		options,
	);
	dialogEl.addEventListener(
		"pointerup",
		(event) => {
			if (pointerStart?.id === event.pointerId && isOutsideDialogCard(event)) {
				const currentElements = activeElementsByDialog.get(dialogEl);
				if (
					activeOpenSource === "hover" &&
					currentElements &&
					pointerStart.overTrigger &&
					isOverTrigger(event, currentElements)
				) {
					promoteHoverToActivation(currentElements, { focusTitle: true });
				} else if (currentElements) {
					closeSnitip(currentElements);
				}
			}
			pointerStart = undefined;
		},
		options,
	);
	dialogEl.addEventListener(
		"pointercancel",
		() => (pointerStart = undefined),
		options,
	);

	dialogEl.addEventListener(
		"close",
		() => {
			// Ignore a previous close after this shared dialog has reopened.
			if (dialogEl.open) return;
			const currentElements = activeElementsByDialog.get(dialogEl);
			if (currentElements) handleSnitipClosed(currentElements);
		},
		options,
	);
	dialogEl.addEventListener(
		"cancel",
		() => {
			const currentElements = activeElementsByDialog.get(dialogEl);
			if (currentElements) prepareSnitipClose(currentElements);
		},
		options,
	);
	dialogEl.addEventListener(
		"keydown",
		(event) => {
			const currentElements = activeElementsByDialog.get(dialogEl);
			if (activeOpenSource === "hover" && currentElements) {
				promoteHoverToActivation(currentElements);
			}
			handleDialogTab(event, dialogEl);
		},
		options,
	);
	dialogFormEl.addEventListener(
		"submit",
		() => {
			const currentElements = activeElementsByDialog.get(dialogEl);
			if (currentElements) prepareSnitipClose(currentElements);
		},
		options,
	);
	dialogFormEl.addEventListener(
		"scroll",
		() => {
			dialogEl.dataset.scrolled = String(dialogFormEl.scrollTop > 0);
		},
		{ ...options, passive: true },
	);
}

/** Initialize newly mounted markup and restore its dialogs when it unmounts. */
export function initializeSnitips(root: ParentNode = document): () => void {
	const cleanups: Array<() => void> = [];
	const triggerEls = root.querySelectorAll<HTMLElement>(
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
		const dialogTitleEl = dialogEl.querySelector<HTMLElement>(
			"[data-snitip-title]",
		);
		if (!dialogFormEl || !dialogArrowEl || !dialogCloseEl || !dialogTitleEl)
			continue;

		const elements: SnitipElements = {
			triggerEl,
			triggerButtonEl,
			dialogEl,
			dialogFormEl,
			dialogArrowEl,
			dialogCloseEl,
			dialogTitleEl,
		};
		const controller = new AbortController();
		const options = { signal: controller.signal };

		triggerEl.dataset.snitipInitialized = "true";
		initializeDialog(elements);
		cleanups.push(() => {
			controller.abort();
			delete triggerEl.dataset.snitipInitialized;
			if (pendingHover === elements) stopHoverTracking();
			if (pendingFocusRestore?.elements === elements) {
				cancelAnimationFrame(pendingFocusRestore.frame);
				pendingFocusRestore = undefined;
			}
			if (snitip === elements) {
				handleSnitipClosed(elements, false);
				dialogEl.close();
			}
			if (activeElementsByDialog.get(dialogEl) === elements) {
				activeElementsByDialog.delete(dialogEl);
			}
			const initialized = initializedDialogs.get(dialogEl);
			if (initialized && --initialized.references === 0) {
				initialized.cleanup();
				initializedDialogs.delete(dialogEl);
			}
		});
		triggerEl.addEventListener(
			"pointerenter",
			(event) => {
				if (
					event.pointerType !== "mouse" ||
					!hoverDialogPointer?.matches ||
					snitip?.dialogEl.open
				)
					return;

				if (mouseEnterTimeout !== undefined) clearTimeout(mouseEnterTimeout);
				pendingHover = elements;
				mouseEnterTimeout = setTimeout(() => {
					mouseEnterTimeout = undefined;
					pendingHover = undefined;
					if (hoverDialogPointer?.matches && triggerEl.matches(":hover")) {
						openSnitip(elements, "hover");
					}
				}, HOVER_OPEN_DELAY_MS);
			},
			options,
		);
		triggerEl.addEventListener(
			"pointerleave",
			() => {
				if (mouseEnterTimeout !== undefined) {
					clearTimeout(mouseEnterTimeout);
					mouseEnterTimeout = undefined;
					pendingHover = undefined;
				}
			},
			options,
		);
		triggerButtonEl.addEventListener("pointerdown", stopHoverTracking, options);
		triggerButtonEl.addEventListener(
			"keydown",
			(event) => {
				if (event.key === "Enter" || event.key === " ") stopHoverTracking();
			},
			options,
		);
		triggerButtonEl.addEventListener(
			"click",
			(event) => {
				openSnitip(elements, "activation", event.detail === 0);
			},
			options,
		);
	}

	return () => {
		for (const cleanup of cleanups.splice(0).reverse()) cleanup();
	};
}

if (typeof document !== "undefined") initializeSnitips();
