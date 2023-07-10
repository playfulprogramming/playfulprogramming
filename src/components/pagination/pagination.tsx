import styles from "./pagination.module.scss";
import forward from "src/icons/arrow_right.svg?raw";
import back from "src/icons/arrow_left.svg?raw";
import { PaginationMenuAndPopover } from "components/pagination/pagination-popover";
import { useEffect, useState } from "preact/hooks";
import {
	PaginationButtonProps,
	PaginationProps,
} from "components/pagination/types";
import { onSoftNavClick } from "components/pagination/on-click-base";

const PAGE_BUTTON_COUNT = 6;

function PaginationButton({
	pageInfo,
	pageNum,
	href,
	selected,
	shouldSoftNavigate,
}: PaginationButtonProps) {
	const pageOptionalMin = Math.min(
		Math.max(1, pageInfo.currentPage - 1),
		pageInfo.lastPage - 3
	);
	const isOptional = pageNum < pageOptionalMin || pageNum > pageOptionalMin + 3;

	return (
		<li
			className={`${styles.paginationItem} ${
				isOptional ? styles.paginationItemExtra : ""
			}`}
		>
			<a
				className={`text-style-body-medium-bold ${styles.paginationButton} ${
					selected ? styles.selected : ""
				}`}
				href={href}
				onClick={shouldSoftNavigate ? onSoftNavClick : undefined}
				aria-label={`Go to page ${pageNum}`}
				aria-current={selected || undefined}
			>
				{pageNum + ""}
			</a>
		</li>
	);
}

/**
 * This prevents the pagination menu from rendering on SSR, which throws errors
 */
function PaginationMenuWrapper(
	props: Pick<PaginationProps, "page" | "getPageHref" | "shouldSoftNavigate">
) {
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		setShouldRender(true);
	});

	if (!shouldRender) return null;

	return <PaginationMenuAndPopover {...props} />;
}

export const Pagination = ({
	page,
	class: className = "",
	id = "post-list-pagination",
	getPageHref = (pageNum: number) => `./${pageNum}`,
	shouldSoftNavigate = false,
}: PaginationProps) => {
	// if there's only one page, don't render anything
	if (page.currentPage === 1 && page.lastPage < 2) return <></>;

	const isPreviousEnabled = page.currentPage > 1;
	const isNextEnabled = page.currentPage < page.lastPage;

	// dots should only be enabled if there are more pages than we can display as buttons
	const isDotsEnabled = page.lastPage > PAGE_BUTTON_COUNT;
	// if the current page is close to the end, dots should be before so that the end is continuous
	const isDotsFirst = page.lastPage - page.currentPage < PAGE_BUTTON_COUNT;

	const firstPageNum = Math.max(
		2,
		Math.min(page.lastPage - PAGE_BUTTON_COUNT, page.currentPage - 1)
	);
	const pages = [
		// first page is always displayed
		1,
		isDotsFirst && "...",
		...Array(PAGE_BUTTON_COUNT)
			.fill(0)
			.map((_, i) => i + firstPageNum),
		!isDotsFirst && "...",
		// last page is always displayed
		page.lastPage,
	].filter(
		// ensure that displayed pages are within the desired range
		(i) => (i === "..." && isDotsEnabled) || (+i > 0 && +i <= page.lastPage)
	);

	return (
		<>
			<div role="navigation" aria-label="Pagination Navigation">
				<ul id={id} className={`${styles.pagination} ${className}`}>
					<li className={`${styles.paginationItem}`}>
						<a
							className={`text-style-body-medium-bold ${styles.paginationButton} ${styles.paginationIconButton}`}
							aria-label="Previous"
							href={
								!isPreviousEnabled
									? "javascript:void(0)"
									: getPageHref(page.currentPage - 1)
							}
							onClick={shouldSoftNavigate ? onSoftNavClick : undefined}
							aria-disabled={!isPreviousEnabled}
							dangerouslySetInnerHTML={{ __html: back }}
						/>
					</li>

					{pages.map((pageNum) => {
						return typeof pageNum === "number" ? (
							<PaginationButton
								pageInfo={page}
								pageNum={pageNum}
								selected={pageNum === page.currentPage}
								href={getPageHref(pageNum)}
								shouldSoftNavigate={shouldSoftNavigate}
							/>
						) : (
							<PaginationMenuWrapper
								page={page}
								getPageHref={getPageHref}
								shouldSoftNavigate={shouldSoftNavigate}
							/>
						);
					})}

					<li className={`${styles.paginationItem}`}>
						<a
							className={`text-style-body-medium-bold ${styles.paginationButton} ${styles.paginationIconButton}`}
							href={
								!isNextEnabled
									? "javascript:void(0)"
									: getPageHref(page.currentPage + 1)
							}
							onClick={shouldSoftNavigate ? onSoftNavClick : undefined}
							aria-label="Next"
							aria-disabled={!isNextEnabled}
							dangerouslySetInnerHTML={{ __html: forward }}
						/>
					</li>
				</ul>
			</div>
		</>
	);
};
