/**
 * This file exists because of our integration/complexity involving client-side
 * search/filter. The alternative to a context is to have all of the components
 * (paginations, post list, etc) as the child to a component containing all
 * of the logic. This isn't something I wanted for our codebase, as it makes
 * reading through the templates much harder
 */
import {
  createContext,
  default as React,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SearchAndFilterContext,
  usePostTagsFromNodes,
  useSearchFilterValue,
} from "constants/search-and-filter-context";
import { filterPostsBySlugArr, getSkippedPosts } from "utils/handle-post-list";
import { PostInfo } from "types/PostInfo";
import { ListViewPosts } from "../../api";

export const defaultSearchAndFilterContextVal = {
  postsToDisplay: [] as ListViewPosts,
  pageCount: 0 as number,
  pageIndex: 0 as number,
  setCurrentPageIndex: (val: number) => {},
  postTags: [] as string[],
};

export const PostListContext = createContext(defaultSearchAndFilterContextVal);

interface PostListContextProps {
  numberOfPages: number;
  limitNumber: number;
  pageIndex: number;
  posts: ListViewPosts;
}

export const PostListProvider: React.FC<PostListContextProps> = ({
  children,
  numberOfPages,
  limitNumber,
  pageIndex: originalPageIndexPlusOne,
  posts,
}) => {
  /**
   * In order to get around limitations with GQL query calls, we originally
   * added one to the page index. Now to remove it to avoid confusion with other
   * zero-indexed code interop
   * @type {number}
   */
  const originalPageIndex = originalPageIndexPlusOne - 1;
  const searchContextValue = useSearchFilterValue();

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
  const [filteredByPosts, setFilteredPosts] = useState<ListViewPosts>([]);

  const [postsToDisplay, setPostsToDisplay] = useState<ListViewPosts>(
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
    if (!searchContextValue.searchVal && !searchContextValue.filterVal.length) {
      setCurrentPageIndex(originalPageIndex);
      setFilteredPosts(posts);
      return;
    }

    setFilteredPosts(
      filterPostsBySlugArr(posts, searchContextValue.lunrAllowedIds)
    );
    setCurrentPageIndex(0);
  }, [
    searchContextValue.searchVal,
    searchContextValue.filterVal,
    searchContextValue.lunrAllowedIds,
    posts,
    originalPageIndex,
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
  const { pageCount, pageIndex } = useMemo(() => {
    if (!searchContextValue.searchVal && !searchContextValue.filterVal.length)
      return {
        pageCount: numberOfPages,
        pageIndex: originalPageIndex,
      };
    return {
      pageCount: Math.ceil(filteredByPosts.length / limitNumber),
      pageIndex: currentPageIndex,
    };
  }, [
    searchContextValue.searchVal,
    searchContextValue.filterVal,
    numberOfPages,
    filteredByPosts,
    limitNumber,
    currentPageIndex,
    originalPageIndex,
  ]);

  /**
   * Despite "best judgement", this needs to be present here instead of inside the
   * `post-list` component. This is because it's populating the _full_ list of
   * tags. If this is moved to something that's being fed `postsToDisplay`,
   * it will hang the website. This is because it will be caught in an infinite
   * loop of computing the tags and updating the post
   */
  const postTags = usePostTagsFromNodes(posts) as string[];

  const contextValue = {
    pageCount,
    pageIndex,
    postsToDisplay,
    setCurrentPageIndex,
    postTags,
  };

  return (
    <PostListContext.Provider value={contextValue}>
      <SearchAndFilterContext.Provider value={searchContextValue}>
        {children}
      </SearchAndFilterContext.Provider>
    </PostListContext.Provider>
  );
};
