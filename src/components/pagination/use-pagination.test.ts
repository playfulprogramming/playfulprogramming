import { renderHook } from "@testing-library/preact";
import { usePagination } from "./use-pagination";

test("usePagination returns pages from 1..3", async () => {
	const pagination = renderHook(() => {
		return usePagination({
			currentPage: 2,
			lastPage: 3,
		});
	}).result.current;

	expect(pagination.isDotsEnabled).toBe(false);
	expect(pagination.isPreviousEnabled).toBe(true);
	expect(pagination.isNextEnabled).toBe(true);
	expect(pagination.pages).toBe([1, 2, 3]);
});
