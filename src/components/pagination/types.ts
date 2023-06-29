export interface PageInfo {
	currentPage: number;
	lastPage: number;
}

export interface PaginationButtonProps {
	pageInfo: PageInfo;
	pageNum: number;
	selected: boolean;
	href: string;
}

export interface PaginationProps {
	page: PageInfo;
	class?: string;
	id?: string;
	rootURL?: string;
	getPageHref?: (pageNum: number) => string;
}
