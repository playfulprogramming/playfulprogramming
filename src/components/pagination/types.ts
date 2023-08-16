export interface PageInfo {
	currentPage: number;
	lastPage: number;
}

export interface PaginationButtonProps {
	pageInfo: PageInfo;
	pageNum: number;
	selected: boolean;
	href: string;
	softNavigate?: (href: string) => void;
}

export interface PaginationProps {
	page: PageInfo;
	class?: string;
	id?: string;
	rootURL?: string;
	getPageHref?: (pageNum: number) => string;
	softNavigate?: (href: string) => void;
	testId?: string;
}
