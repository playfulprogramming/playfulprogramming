import type { Locale } from "#src/paraglide/runtime.js";

export interface PageInfo {
	currentPage: number;
	lastPage: number;
}

export interface PaginationButtonProps {
	pageInfo: PageInfo;
	pageNum: number;
	selected: boolean;
	href: string;
	softNavigate?: (href: string, pageNum: number) => void;
	locale: Locale;
}

export interface PaginationProps {
	page: PageInfo;
	locale: Locale;
	class?: string;
	divClass?: string;
	id?: string;
	rootURL?: string;
	getPageHref?: (pageNum: number) => string;
	softNavigate?: (href: string, pageNum: number) => void;
	testId?: string;
}
