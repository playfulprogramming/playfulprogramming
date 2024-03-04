import { renderHook } from "@testing-library/preact";
import { usePagination } from "./use-pagination";

test("usePagination returns pages from 1..3", async () => {
	const pagination = renderHook(() => {
		return usePagination({
			currentPage: 2,
			lastPage: 3,
		});
	}).result.current;

	expect(pagination.pages).toEqual([1, 2, 3]);
});

test("on the first page of 1..11, the more indicator is between 9..11", async () => {
	const pagination = renderHook(() => {
		return usePagination({
			currentPage: 1,
			lastPage: 11,
		});
	}).result.current;

	expect(pagination.pages).toContain("...");
	expect(pagination.pages.at(-2)).toBe("..."); // "..." should be before the end
	expect(pagination.pages).toContain(1);
	expect(pagination.pages).toContain(11);
	expect(pagination.pages).not.toContain(10);
});

test("on the last page of 1..11, the more indicator is between 1..3", async () => {
	const pagination = renderHook(() => {
		return usePagination({
			currentPage: 11,
			lastPage: 11,
		});
	}).result.current;

	expect(pagination.pages).toContain("...");
	expect(pagination.pages[1]).toBe("..."); // "..." should be after the start
	expect(pagination.pages).toContain(1);
	expect(pagination.pages).toContain(11);
	expect(pagination.pages).not.toContain(2);
});

test("on the first page of 1..11, the 'prev' button is inactive", async () => {
	const pagination = renderHook(() => {
		return usePagination({
			currentPage: 1,
			lastPage: 11,
		});
	}).result.current;

	expect(pagination.isPreviousEnabled).toBe(false);
	expect(pagination.isNextEnabled).toBe(true);
});

test("on the last page of 1..11, the 'next' button is inactive", async () => {
	const pagination = renderHook(() => {
		return usePagination({
			currentPage: 11,
			lastPage: 11,
		});
	}).result.current;

	expect(pagination.isPreviousEnabled).toBe(true);
	expect(pagination.isNextEnabled).toBe(false);
});

test("when all pages can be displayed (1..8), the '...' button is hidden", async () => {
	const pagination = renderHook(() => {
		return usePagination({
			currentPage: 1,
			lastPage: 8,
		});
	}).result.current;

	expect(pagination.pages).not.toContain("...");
	expect(pagination.pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});

test("when a page might be hidden (1..9), the '...' button is shown", async () => {
	const pagination = renderHook(() => {
		return usePagination({
			currentPage: 1,
			lastPage: 9,
		});
	}).result.current;

	expect(pagination.pages).toContain("...");
	expect(pagination.pages).toEqual([1, 2, 3, 4, 5, 6, 7, "...", 9]);
});
