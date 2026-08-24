import type { Translate } from "#utils/translations.ts";

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
	translate: Translate;
}

export interface PaginationProps {
	page: PageInfo;
	translate: Translate;
	class?: string;
	divClass?: string;
	id?: string;
	rootURL?: string;
	getPageHref?: (pageNum: number) => string;
	softNavigate?: (href: string, pageNum: number) => void;
	testId?: string;
}
