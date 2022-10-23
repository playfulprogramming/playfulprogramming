import { createContext, useEffect, useMemo, useState } from "react";
import { useLunr } from "uu-utils";
import { UseSelectableArrayInternalVal } from "batteries-not-included";
import { PostInfo } from "types/PostInfo";
import { debounce } from "utils/debounce";
import { usePlausible } from "next-plausible";

// We only have dark and light right now
export const defaultSearchAndFilterContextVal = {
  searchVal: "",
  /**
   * @type {string[]} A list of strings matching the tag IDs that we filter by
   */
  filterVal: [] as any[],
  setSearchVal: (val: string) => {},
  setFilterVal: (val: UseSelectableArrayInternalVal<string>[]) => {},
};

export const SearchAndFilterContext = createContext(
  defaultSearchAndFilterContextVal
);

export const usePostTagsFromNodes = <T extends { tags: PostInfo["tags"] }>(
  posts: T[]
) => {
  const postTags = useMemo(() => {
    return Array.from(
      posts.reduce((prev, post) => {
        post.tags.forEach((tag) => prev.add(tag));
        return prev;
      }, new Set())
    );
  }, [posts]);

  return postTags.sort();
};

type UsePlausible = ReturnType<typeof usePlausible>;

const debouncedFilterGA = debounce(
  (plausible: UsePlausible, filterVal: Array<{ val: string }>) => {
    plausible("filter", {
      props: {
        event_label: filterVal.map((v) => v.val).join(" "),
      },
    });
  },
  1000,
  false
);

const debouncedSearchGA = debounce(
  (plausible: UsePlausible, searchVal: string) => {
    if (!searchVal) return;
    plausible("search", {
      props: { searchVal },
    });
  },
  1000,
  false
);

/**
 * Get the default value for the search and filter context provider
 */
export const useSearchFilterValue = () => {
  const plausible = usePlausible();

  /**
   * The local states of the filter and search
   *
   * Filter should be an array of strings marking the ids that they'll be filtered
   * be
   *
   * Search should be a string matching
   */
  const [filterVal, setFilterVal] = useState<
    UseSelectableArrayInternalVal<string>[]
  >([]);
  const [searchVal, setSearchVal] = useState("");

  /**
   * These are the arrays of post node ids that are allowed to be shown to the user
   * However, due to bring splut between filter and search, we still need to limit
   * them
   */
  const { searchUsingLunr: filterUsingLunr, results: lunrFilterIds } =
    useLunr();
  const { searchUsingLunr, results: lunrSearchIds } = useLunr();

  useEffect(() => {
    if (!filterVal || !filterVal.length) {
      filterUsingLunr("");
    } else {
      filterUsingLunr(`tags: ${filterVal.map((v) => v.val).join(" ")}`);

      debouncedFilterGA(plausible, filterVal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plausible, filterVal]);

  useEffect(() => {
    searchUsingLunr(searchVal);

    if (searchVal) {
      debouncedSearchGA(plausible, searchVal);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plausible, searchVal]);

  /**
   * An array of all allowed posts to be shown to the user
   * @type {string[]}
   */
  const lunrAllowedIds = useMemo(() => {
    if (lunrFilterIds && lunrSearchIds) {
      const lunrFilterIdsSlugs = lunrFilterIds.map((v) => v.slug);
      const lunrSearchIdsSlugs = lunrSearchIds.map((v) => v.slug);
      return lunrFilterIdsSlugs.filter((v) => lunrSearchIdsSlugs.includes(v));
    }

    if (lunrFilterIds) return lunrFilterIds.map((v) => v.slug);
    if (lunrSearchIds) return lunrSearchIds.map((v) => v.slug);
    return [];
  }, [lunrFilterIds, lunrSearchIds]);

  return useMemo(
    () => ({
      searchVal,
      filterVal,
      setSearchVal,
      setFilterVal,
      lunrAllowedIds,
    }),
    [searchVal, filterVal, setSearchVal, setFilterVal, lunrAllowedIds]
  );
};
