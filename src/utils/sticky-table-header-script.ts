/**
 * Sets the `data-sticky-headers` attribute on each `.table-container`
 * on overflow and removes it when not overflowing.
 */
function updateStickyHeaderState(
	items: (ResizeObserverEntry | HTMLDivElement)[],
) {
	for (const item of items) {
		let tableContainer;
		if (item instanceof ResizeObserverEntry) {
			tableContainer = item.target as HTMLDivElement;
		} else {
			tableContainer = item;
		}

		// Check for overflow
		if (tableContainer.scrollWidth > tableContainer.clientWidth) {
			tableContainer.dataset.stickyHeaders = "";
			continue;
		}

		delete tableContainer.dataset.stickyHeaders;
	}
}

/**
 * Finds all `.table-container` elements on the page, observes them with a
 * `ResizeObserver` to react to overlflow by adding `data-sticky-headers` attribute on overflow.
 * Also run this on first run for intial overflow check before any resize.
 */
export function enableStickyTableHeaderListener() {
	const tableContainers = Array.from(
		document.querySelectorAll<HTMLDivElement>(".table-container"),
	);

	if (!tableContainers.length) return;

	const resizeObserver = new ResizeObserver(updateStickyHeaderState);
	for (const tableContainer of tableContainers) {
		resizeObserver.observe(tableContainer);
	}

	updateStickyHeaderState(tableContainers);
}
