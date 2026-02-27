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
