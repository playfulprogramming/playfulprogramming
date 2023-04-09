import { Page } from "astro";
import styles from "./pagination.module.scss";
import { Button } from "components/base";
import forward from "src/icons/forward.svg?raw";
import back from "src/icons/back.svg?raw";
import more from "src/icons/more-horizontal.svg?raw";

const PAGE_BUTTON_COUNT = 6;

interface PaginationProps {
	page: Pick<Page<any>, "currentPage" | "lastPage">;
	class?: string;
	id?: string;
	rootURL?: string;
	getPageHref?: (pageNum: number) => string;
}

function PaginationButton(props: { pageNum: number, selected: boolean, href: string }) {
	return (
		<li
			class={`${styles.paginationItem} ${
				props.selected ? styles.active : ""
			}`}
		>
			<Button
				href={props.href}
				aria-label={`Go to page ${props.pageNum}`}
				aria-current={props.selected || undefined}
				state={props.selected ? "selected" : undefined}
				class="text-style-body-medium-bold"
			>
				{props.pageNum + ""}
			</Button>
		</li>
	)
}

function PaginationMenu(props: Pick<PaginationProps, "page" | "getPageHref">) {
	return (
		<li
			class={`${styles.paginationItem}`}
		>
			<Button>
				<span dangerouslySetInnerHTML={{ __html: more }} />
			</Button>
		</li>
	)
}

export const Pagination = ({
	page,
	rootURL = "./",
	class: className = "",
	id = "post-list-pagination",
	getPageHref = (pageNum: number) => `${rootURL}${pageNum}`,
}: PaginationProps) => {
	// if there's only one page, don't render anything
	if (page.currentPage === 1 && page.lastPage < 2)
		return <></>;

	const isPreviousEnabled = page.currentPage > 1;
	const isNextEnabled = page.currentPage < page.lastPage;

	// dots should only be enabled if there are more pages than we can display as buttons
	const isDotsEnabled = page.lastPage > PAGE_BUTTON_COUNT;
	// if the current page is close to the end, dots should be before so that the end is continuous
	const isDotsFirst = page.lastPage - page.currentPage < PAGE_BUTTON_COUNT;

	const firstPageNum = Math.max(2, Math.min(page.lastPage - PAGE_BUTTON_COUNT, page.currentPage - 1));
	const pages = [
		// first page is always displayed
		1,
		isDotsFirst && "...",
		...Array(PAGE_BUTTON_COUNT).fill(0).map((_, i) => i + firstPageNum),
		!isDotsFirst && "...",
		// last page is always displayed
		page.lastPage,
	].filter(
		// ensure that displayed pages are within the desired range
		i => (i === "..." && isDotsEnabled) || (+i > 0 && +i <= page.lastPage)
	);

	return <>
		<div role="navigation" aria-label="Pagination Navigation">
			<ul
				id={id}
				class={`${styles.pagination} ${className}`}
			>
				<li class={`${styles.paginationItem} ${styles.previous}`}>
					<Button
						href={getPageHref(page.currentPage - 1)}
						aria-label="Previous"
						disabled={!isPreviousEnabled}
					>
						<span dangerouslySetInnerHTML={{ __html: back }} />
					</Button>
				</li>

				{pages.map(pageNum => {
					return typeof pageNum === "number"
						? (
							<PaginationButton
								pageNum={pageNum}
								selected={pageNum === page.currentPage}
								href={getPageHref(pageNum)}
							/>
						)
						: (
							<PaginationMenu
								page={page}
								getPageHref={getPageHref}
							/>
						);
				})}

				<li class={`${styles.paginationItem} ${styles.next}`}>
					<Button
						href={getPageHref(page.currentPage + 1)}
						aria-label="Next"
						disabled={!isNextEnabled}
					>
						<span dangerouslySetInnerHTML={{ __html: forward }} />
					</Button>
				</li>
			</ul>
		</div>
	</>;
};
