import styles from "./pagination.module.scss";
import forward from "src/icons/arrow_right.svg?raw";
import back from "src/icons/arrow_left.svg?raw";
import { PaginationMenuAndPopover } from "components/pagination/pagination-popover";
import { useEffect, useState } from "preact/hooks";
import {
	PaginationButtonProps,
	PaginationProps,
} from "components/pagination/types";
import { usePagination } from "./use-pagination";
import { onSoftNavClick } from "./on-click-base";

function PaginationButton({
	pageInfo,
	pageNum,
	href,
	selected,
	softNavigate,
}: PaginationButtonProps) {
	const pageOptionalMin = Math.min(
		Math.max(1, pageInfo.currentPage - 1),
		pageInfo.lastPage - 3,
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
				onClick={
					softNavigate ? onSoftNavClick(softNavigate, pageNum) : undefined
				}
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
	props: Pick<PaginationProps, "page" | "getPageHref" | "softNavigate">,
) {
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		setShouldRender(true);
	});

	// if this is a static render, this still needs to return an <li> node so that
	// it hydrates in the correct order
	if (!shouldRender) return <li hidden></li>;

	return <PaginationMenuAndPopover {...props} />;
}

export const Pagination = ({
	page,
	rootURL = "./",
	class: className = "",
	id = "post-list-pagination",
	getPageHref = (pageNum: number) => `${rootURL}${pageNum}`,
	softNavigate,
	testId,
}: PaginationProps) => {
	// if there's only one page, don't render anything
	if (page.currentPage === 1 && page.lastPage < 2) return <></>;

	const { isPreviousEnabled, isNextEnabled, pages } = usePagination(page);

	return (
		<>
			<div
				role="navigation"
				aria-label="Pagination Navigation"
				data-testid={testId}
			>
				<ul id={id} className={`${styles.pagination} ${className}`}>
					<li className={`${styles.paginationItem}`}>
						<a
							data-testid="pagination-previous"
							className={`text-style-body-medium-bold ${styles.paginationButton} ${styles.paginationIconButton}`}
							aria-label="Previous page"
							href={
								!isPreviousEnabled
									? "javascript:void(0)"
									: getPageHref(page.currentPage - 1)
							}
							onClick={
								softNavigate
									? onSoftNavClick(softNavigate, page.currentPage - 1)
									: undefined
							}
							aria-disabled={!isPreviousEnabled}
							dangerouslySetInnerHTML={{ __html: back }}
						/>
					</li>

					{pages.map((pageNum) => {
						return typeof pageNum === "number" ? (
							<PaginationButton
								key={pageNum}
								pageInfo={page}
								pageNum={pageNum}
								selected={pageNum === page.currentPage}
								href={getPageHref(pageNum)}
								softNavigate={softNavigate}
							/>
						) : (
							<PaginationMenuWrapper
								key={pageNum}
								page={page}
								getPageHref={getPageHref}
								softNavigate={softNavigate}
							/>
						);
					})}

					<li className={`${styles.paginationItem}`}>
						<a
							data-testid="pagination-next"
							className={`text-style-body-medium-bold ${styles.paginationButton} ${styles.paginationIconButton}`}
							href={
								!isNextEnabled
									? "javascript:void(0)"
									: getPageHref(page.currentPage + 1)
							}
							onClick={
								softNavigate
									? onSoftNavClick(softNavigate, page.currentPage + 1)
									: undefined
							}
							aria-label="Next page"
							aria-disabled={!isNextEnabled}
							dangerouslySetInnerHTML={{ __html: forward }}
						/>
					</li>
				</ul>
			</div>
		</>
	);
};
