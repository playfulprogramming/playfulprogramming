import * as React from "react";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { SearchAndFilterContext } from "constants/search-and-filter-context";
import { PostListContext } from "constants/post-list-context";
import styles from "./pagination.module.scss";

interface PaginationProps {
  absolutePath: string;
}
export const Pagination = ({ absolutePath }: PaginationProps) => {
  const { pageCount, pageIndex, setCurrentPageIndex } =
    React.useContext(PostListContext);
  const { searchVal, filterVal } = React.useContext(SearchAndFilterContext);
  const router = useRouter();

  if (!pageCount) return null;

  const forwardSlashedBase = absolutePath.endsWith("/")
    ? absolutePath
    : `${absolutePath}/`;

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
      hrefBuilder={(pageIndex) => `${forwardSlashedBase}page/${pageIndex + 1}`}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      disabledClassName={styles.showNothing}
      onPageChange={({ selected }) => {
        if (filterVal.length || searchVal) {
          setCurrentPageIndex(selected);
          return;
        }

        // Even though we index at 1 for pages, this component indexes at 0
        const newPageIndex = selected;
        if (newPageIndex === 0) {
          router.push(forwardSlashedBase);
          return;
        }
        router.push(`${forwardSlashedBase}page/${newPageIndex + 1}`);
      }}
    />
  );
};
