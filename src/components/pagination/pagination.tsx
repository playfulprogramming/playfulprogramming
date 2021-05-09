import * as React from "react";
import { navigate } from "gatsby-link";
import ReactPaginate from "react-paginate";
import { SearchAndFilterContext } from "constants/search-and-filter-context";
import { PostListContext } from "constants/post-list-context";
import "./pagination.scss";

interface PaginationProps {
	absolutePath: string;
}
export const Pagination = ({ absolutePath }: PaginationProps) => {
	const { pageCount, pageIndex, setCurrentPageIndex } = React.useContext(
		PostListContext
	);
	const { searchVal, filterVal } = React.useContext(SearchAndFilterContext);

	if (!pageCount) return null;

	return (
		<ReactPaginate
			previousLabel={
				<>
					<span aria-hidden={true}>{"<"}</span>
					<span aria-hidden={false}> Previous</span>
				</>
			}
			nextLabel={
				<>
					<span aria-hidden={false}>Next </span>
					<span aria-hidden={true}>{">"}</span>
				</>
			}
			breakLabel="..."
			breakClassName="break-me"
			pageCount={pageCount}
			marginPagesDisplayed={2}
			forcePage={pageIndex}
			pageRangeDisplayed={5}
			hrefBuilder={pageIndex => `${absolutePath}page/${pageIndex}`}
			containerClassName="pagination"
			activeClassName="active"
			onPageChange={({ selected }) => {
				if (filterVal.length || searchVal) {
					setCurrentPageIndex(selected);
					return;
				}

				// Even though we index at 1 for pages, this component indexes at 0
				const newPageIndex = selected + 1;
				if (newPageIndex === 1) {
					navigate(absolutePath);
					return;
				}
				navigate(`${absolutePath}page/${newPageIndex}`);
			}}
		/>
	);
};
