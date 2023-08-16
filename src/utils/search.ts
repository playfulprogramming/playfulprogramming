export const SEARCH_QUERY_KEY = "searchQuery";
export const SEARCH_PAGE_KEY = "searchPage";
export const CONTENT_TO_DISPLAY_KEY = "display";
export const FILTER_TAGS_KEY = "filterTags";
export const FILTER_AUTHOR_KEY = "filterAuthors";
export const SORT_KEY = "sort";

interface SearchQuery {
	searchQuery?: string;
	searchPage?: number;
	contentToDisplay?: "all" | "articles" | "collections";
	filterTags?: string[];
	filterAuthors?: string[];
	sort?: "newest" | "oldest";
}

export const buildSearchQuery = ({
	searchQuery = "*",
	searchPage,
	contentToDisplay,
	filterTags,
	filterAuthors,
	sort,
}: SearchQuery) => {
	const query = new URLSearchParams();
	if (searchQuery) query.set(SEARCH_QUERY_KEY, searchQuery);
	if (searchPage) query.set(SEARCH_PAGE_KEY, searchPage.toString());
	if (contentToDisplay) query.set(CONTENT_TO_DISPLAY_KEY, contentToDisplay);
	if (filterTags) query.set(FILTER_TAGS_KEY, filterTags.join(","));
	if (filterAuthors) query.set(FILTER_AUTHOR_KEY, filterAuthors.join(","));
	if (sort) query.set(SORT_KEY, sort);
	// Returned without a question mark
	return query.toString();
};
