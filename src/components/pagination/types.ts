export interface PaginationProps {
	page: {
		currentPage: number;
		lastPage: number;
	};
	class?: string;
	id?: string;
	rootURL?: string;
	getPageHref?: (pageNum: number) => string;
}
