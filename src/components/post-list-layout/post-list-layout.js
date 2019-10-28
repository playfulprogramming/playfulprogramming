import * as React from "react";
import {
	SearchAndFilterContext,
	usePostTagsFromNodes,
	useSearchFilterValue
} from "../search-and-filter-context";
import { useState } from "react";
import { PostList } from "../post-card-list";
import ReactPaginate from "react-paginate";
import { navigate } from "gatsby-link";
import {
	filterPostsBySlugArr,
	getSkippedPosts
} from "../../utils/handle-post-list";
import { useEffect } from "react";
import { useMemo } from "react";

export const PostListLayout = ({
	children,
	posts,
	pageContext,
	...postListProps
}) => {
	const {
		pageIndex: originalPageIndexPlusOne,
		numberOfPages,
		limitNumber,
		relativePath
	} = pageContext;
	/**
	 * In order to get around limitations with GQL query calls, we originally
	 * added one to the page index. Now to remove it to avoid confusion with other
	 * zero-indexed code interop
	 * @type {number}
	 */
	const originalPageIndex = originalPageIndexPlusOne - 1;
	const contextValue = useSearchFilterValue();

	/**
	 * Logic for the posts pagination logic
	 *
	 * User on page
	 *
	 * a: User starts search or filter
	 *
	 * b: User gets set to page 0 with filtered results
	 *
	 * c: When user updates results, set to page 0 with new filtered results (GOTO b)
	 *
	 * d: When user clears results, reset to initial page posts (GOTO a)
	 */
	const [currentPageIndex, setCurrentPageIndex] = useState(originalPageIndex);

	const currentSkipNumber = currentPageIndex * limitNumber;

	const getInitialPagePosts = () =>
		getSkippedPosts(posts, originalPageIndex * limitNumber, limitNumber);

	// If there is no filter or search applied, this should be the original post array
	const [filteredByPosts, setFilteredPosts] = useState([]);

	const [postsToDisplay, setPostsToDisplay] = useState(
		/**
		 * Set the initial value to the expected page's results
		 *
		 * We should be able to overwrite this during a search/filter
		 */
		getInitialPagePosts()
	);

	/**
	 * When the user applies a sort or filter, set the page to 0
	 * This will also trigger a re-grab of data based on the hook below
	 *
	 * In order to avoid doing both the filter and pagination at the same
	 * time every time the user pages (costly), we keep a storage of the
	 * filtered posts to be able to more rapidly paginate through
	 */
	useEffect(() => {
		if (!contextValue.searchVal && !contextValue.filterVal.length) {
			setCurrentPageIndex(originalPageIndex);
			setFilteredPosts(posts);
			return;
		}

		setFilteredPosts(filterPostsBySlugArr(posts, contextValue.lunrAllowedIds));
		setCurrentPageIndex(0);
	}, [
		contextValue.searchVal,
		contextValue.filterVal,
		contextValue.lunrAllowedIds,
		posts,
		originalPageIndex
	]);

	/**
	 * When the user changes the page, let's get the correct number of posts
	 */
	useEffect(() => {
		const getCurrentPagePosts = () =>
			getSkippedPosts(filteredByPosts, currentSkipNumber, limitNumber);

		setPostsToDisplay(getCurrentPagePosts());
	}, [currentPageIndex, filteredByPosts, currentSkipNumber, limitNumber]);

	/**
	 * Data setup to display the posts
	 */
	const postTags = usePostTagsFromNodes(posts);

	const { pageCount, forcePage } = useMemo(() => {
		if (!contextValue.searchVal && !contextValue.filterVal.length)
			return {
				pageCount: numberOfPages,
				forcePage: originalPageIndex
			};
		return {
			pageCount: Math.ceil(filteredByPosts.length / limitNumber),
			forcePage: currentPageIndex
		};
	}, [
		contextValue.searchVal,
		contextValue.filterVal,
		numberOfPages,
		filteredByPosts,
		limitNumber,
		currentPageIndex,
		originalPageIndex
	]);

	return (
		<SearchAndFilterContext.Provider value={contextValue}>
			{children}

			<PostList posts={postsToDisplay} tags={postTags} {...postListProps} />

			{!!pageCount && (
				<ReactPaginate
					previousLabel={"previous"}
					nextLabel={"next"}
					breakLabel={"..."}
					breakClassName={"break-me"}
					pageCount={pageCount}
					marginPagesDisplayed={2}
					forcePage={forcePage}
					pageRangeDisplayed={5}
					hrefBuilder={props => `${relativePath}/page/${props}`}
					containerClassName={"pagination"}
					subContainerClassName={"pages pagination"}
					activeClassName={"active"}
					onPageChange={({ selected }) => {
						if (contextValue.filterVal.length || contextValue.searchVal) {
							setCurrentPageIndex(selected);
							return;
						}

						// Even though we index at 1 for pages, this component indexes at 0
						const newPageIndex = selected + 1;
						if (newPageIndex === 1) {
							navigate(`${relativePath}/`);
							return;
						}
						navigate(`${relativePath}/page/${newPageIndex}`);
					}}
				/>
			)}
		</SearchAndFilterContext.Provider>
	);
};
