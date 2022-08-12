export interface Page {
  display: string;
  pageNumber: number;
  ariaLabel?: string;
}

export const DR = {
  ariaLabel: "Go to the next set of pages",
  display: '...'
};

export const DL = {
  ariaLabel: "Go to previous set of pages",
  display: '...'
};

const range = (start: number, end: number): Page[] => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => {
    const page = idx + start;
    return {
      display: String(page),
      pageNumber: page
    }
  });
};

interface GetPaginationRangeProps {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}

export const getPaginationRange = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
}: GetPaginationRangeProps): Page[] => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    const totalPageCountPage: Page = {
      display: `${totalPageCount}`,
      pageNumber: totalPageCount
    }

    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex: Page = {
      display: "1",
      pageNumber: 1
    };
    const lastPageIndex: Page = {
      display: `${totalPageCount}`,
      pageNumber: totalPageCount
    };

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      const lastPage = leftRange[leftRange.length - 1]
      const DR_Page: Page = {
        ...DR,
        pageNumber: currentPage + 2
      }

      return [...leftRange, DR_Page, totalPageCountPage];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      const DL_Page: Page = {
        ...DL,
        pageNumber: currentPage - 2
      }
      return [firstPageIndex, DL_Page, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      const DL_Page: Page = {
        ...DL,
        pageNumber: currentPage - 2
      }
      const DR_Page: Page = {
        ...DR,
        pageNumber: currentPage + 2
      }
      return [firstPageIndex, DL_Page, ...middleRange, DR_Page, lastPageIndex];
    }
};