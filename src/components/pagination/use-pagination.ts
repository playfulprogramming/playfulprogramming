import { PageInfo } from "components/pagination/types";
import { useMemo } from "preact/hooks";

const PAGE_BUTTON_COUNT = 6;

export function usePagination(page: PageInfo) {
	return useMemo(() => {
		const isPreviousEnabled = page.currentPage > 1;
		const isNextEnabled = page.currentPage < page.lastPage;

		// dots should only be enabled if there are more pages than we can display as buttons
		//   +2 for the first/last page, which are always shown
		const isDotsEnabled = page.lastPage > PAGE_BUTTON_COUNT + 2;
		// if the current page is close to the end, dots should be before so that the end is continuous
		const isDotsFirst = page.lastPage - page.currentPage < PAGE_BUTTON_COUNT;

		const firstPageNum = Math.max(
			2,
			Math.min(page.lastPage - PAGE_BUTTON_COUNT, page.currentPage - 1),
		);

		const pages = [
			// first page is always displayed
			1,
			isDotsFirst && "...",
			...Array(PAGE_BUTTON_COUNT)
				.fill(0)
				.map((_, i) => i + firstPageNum)
				.filter((i) => i < page.lastPage),
			!isDotsFirst && "...",
			// last page is always displayed
			page.lastPage,
		].filter(
			// ensure that displayed pages are within the desired range
			(i) => (i === "..." && isDotsEnabled) || (+i > 0 && +i <= page.lastPage),
		);

		return {
			isPreviousEnabled,
			isNextEnabled,
			isDotsEnabled,
			pages,
		};
	}, [page]);
}
