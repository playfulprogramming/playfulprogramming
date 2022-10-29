import { getPaginationRange } from "./pagination-logic";
import { Page } from "astro";
import { PostInfo } from "types/PostInfo";
import styles from "./pagination.module.scss";

interface PaginationProps {
	page: Pick<Page<PostInfo>, "total" | "currentPage" | "size">;
	class?: string;
	rootURL: string;
	getPageHref?: (pageNum: number) => string;
}

export const Pagination = ({
	page,
	rootURL,
	class: className = "",
	getPageHref = (pageNum: number) =>
		pageNum === 0 || pageNum === 1 ? rootURL : `${rootURL}page/${pageNum}`,
}: PaginationProps) => {
	const paginationRange = getPaginationRange({
		currentPage: page.currentPage,
		totalCount: page.total,
		siblingCount: 0,
		pageSize: page.size,
	});

	const dontShowAnything = page.currentPage === 0 || paginationRange.length < 2;

	const lastPage = paginationRange[paginationRange.length - 1];
	const firstPage = paginationRange[0];

	const disablePrevious =
		!firstPage || page.currentPage === firstPage.pageNumber;
	const disableNext = !lastPage || page.currentPage === lastPage.pageNumber;

	return (
		<>
			{dontShowAnything ? null : (
				<ul
					role="navigation"
					aria-label="Pagination Navigation"
					class={`${styles.pagination} ${className}`}
				>
					{!disablePrevious && (
						<li class={`${styles.paginationItem} ${styles.previous}`}>
							<a href={getPageHref(page.currentPage - 1)} aria-label="Previous">
								{"<"}
							</a>
						</li>
					)}

					{paginationRange.map((pageItem) => {
						const isSelected = pageItem.pageNumber === page.currentPage;
						return (
							<li
								class={`${styles.paginationItem} ${
									isSelected ? styles.active : ""
								}`}
							>
								<a
									href={getPageHref(pageItem.pageNumber)}
									aria-label={pageItem.ariaLabel}
									aria-current={isSelected || undefined}
								>
									{pageItem.display}
								</a>
							</li>
						);
					})}

					{!disableNext && (
						<li class={`${styles.paginationItem} ${styles.next}`}>
							<a href={getPageHref(page.currentPage + 1)} aria-label="Next">
								{">"}
							</a>
						</li>
					)}
				</ul>
			)}
		</>
	);
};
