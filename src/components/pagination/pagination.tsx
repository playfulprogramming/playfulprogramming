import styles from "./pagination.module.scss";
import forward from "src/icons/arrow_right.svg?raw";
import back from "src/icons/arrow_left.svg?raw";
import { PaginationMenuAndPopover } from "components/pagination/pagination-popover";
import { useEffect, useState } from "preact/hooks";
import { PaginationButtonProps, PaginationProps } from "components/pagination/types";
import { usePagination } from "./use-pagination";

function PaginationButton({
	pageInfo,
	pageNum,
	href,
	selected
}: PaginationButtonProps) {
	const pageOptionalMin = Math.min(Math.max(1, pageInfo.currentPage - 1), pageInfo.lastPage - 3);
	const isOptional = pageNum < pageOptionalMin || pageNum > pageOptionalMin + 3;

	return (
		<li className={`${styles.paginationItem} ${isOptional ? styles.paginationItemExtra : ''}`}>
			<a
				className={`text-style-body-medium-bold ${styles.paginationButton} ${
					selected ? styles.selected : ""
				}`}
				href={href}
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
	props: Pick<PaginationProps, "page" | "getPageHref">
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
	rootURL = "./",
	class: className = "",
	id = "post-list-pagination",
	getPageHref = (pageNum: number) => `${rootURL}${pageNum}`,
}: PaginationProps) => {
	// if there's only one page, don't render anything
	if (page.currentPage === 1 && page.lastPage < 2) return <></>;

	const { isPreviousEnabled, isNextEnabled, pages } = usePagination(page);

	return (
		<>
			<div role="navigation" aria-label="Pagination Navigation">
				<ul id={id} className={`${styles.pagination} ${className}`}>
					<li className={`${styles.paginationItem}`}>
						<a
							className={`text-style-body-medium-bold ${styles.paginationButton} ${styles.paginationIconButton}`}
							aria-label="Previous"
							href={!isPreviousEnabled ? "javascript:void(0)" : getPageHref(page.currentPage - 1)}
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
							/>
						) : (
							<PaginationMenuWrapper page={page} getPageHref={getPageHref} />
						);
					})}

					<li className={`${styles.paginationItem}`}>
						<a
							className={`text-style-body-medium-bold ${styles.paginationButton} ${styles.paginationIconButton}`}
							href={!isNextEnabled ? "javascript:void(0)" : getPageHref(page.currentPage + 1)}
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
