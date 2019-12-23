import {
	createContext,
	default as React,
	useEffect,
	useMemo,
	useState
} from "react";
import { useLunr } from "../../utils/useLunr";

// We only have dark and light right now
export const defaultSearchAndFilterContextVal = {
	searchVal: "",
	/**
	 * @type {string[]} A list of strings matching the tag IDs that we filter by
	 */
	filterVal: [],
	setSearchVal: val => {},
	setFilterVal: val => {}
};

export const SearchAndFilterContext = createContext(
	defaultSearchAndFilterContextVal
);

export const usePostTagsFromNodes = posts => {
	const postTags = useMemo(() => {
		return Array.from(
			posts.reduce((prev, post) => {
				post.node.frontmatter.tags.forEach(tag => prev.add(tag));
				return prev;
			}, new Set())
		);
	}, [posts]);

	return postTags;
};

/**
 * Get the default value for the search and filter context provider
 */
export const useSearchFilterValue = () => {
	/**
	 * The local states of the filter and search
	 *
	 * Filter should be an array of strings marking the ids that they'll be filtered
	 * be
	 *
	 * Search should be a string matching
	 */
	const [filterVal, setFilterVal] = useState([]);
	const [searchVal, setSearchVal] = useState("");

	/**
	 * These are the arrays of post node ids that are allowed to be shown to the user
	 * However, due to bring splut between filter and search, we still need to limit
	 * them
	 */
	const {
		searchUsingLunr: filterUsingLunr,
		results: lunrFilterIds
	} = useLunr();
	const { searchUsingLunr, results: lunrSearchIds } = useLunr();

	useEffect(() => {
		if (!filterVal || !filterVal.length) {
			filterUsingLunr("");
		} else {
			filterUsingLunr(`tags: ${filterVal.map(v => v.val).join(" ")}`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterVal]);

	useEffect(() => {
		searchUsingLunr(searchVal);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchVal]);

	/**
	 * An array of all allowed posts to be shown to the user
	 * @type {string[]}
	 */
	const lunrAllowedIds = useMemo(() => {
		if (lunrFilterIds && lunrSearchIds) {
			const lunrFilterIdsSlugs = lunrFilterIds.map(v => v.slug);
			const lunrSearchIdsSlugs = lunrSearchIds.map(v => v.slug);
			return lunrFilterIdsSlugs.filter(v => lunrSearchIdsSlugs.includes(v));
		}

		if (lunrFilterIds) return lunrFilterIds.map(v => v.slug);
		if (lunrSearchIds) return lunrSearchIds.map(v => v.slug);
		return [];
	}, [lunrFilterIds, lunrSearchIds]);

	return React.useMemo(
		() => ({
			searchVal,
			filterVal,
			setSearchVal,
			setFilterVal,
			lunrAllowedIds
		}),
		[searchVal, filterVal, setSearchVal, setFilterVal, lunrAllowedIds]
	);
};
