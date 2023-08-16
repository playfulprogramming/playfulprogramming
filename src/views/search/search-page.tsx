import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "preact/hooks";
import { Pagination } from "components/pagination/pagination";
import { PostInfo } from "types/PostInfo";
import { useSearchParams } from "./use-search-params";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { useDebouncedValue } from "./use-debounced-value";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";

import style from "./search-page.module.scss";
import { PostCardGrid } from "components/post-card/post-card-grid";
import { SubHeader } from "components/subheader/subheader";
import { Fragment } from "preact";
import { ExtendedCollectionInfo } from "types/CollectionInfo";
import { CollectionCard } from "components/collection-card/collection-card";
import { FilterDisplay } from "./components/filter-display";
import { useElementSize } from "../../hooks/use-element-size";
import { SearchTopbar } from "./components/search-topbar";
import { SearchHero } from "./components/search-hero";
import { LargeButton } from "components/button/button";
import retry from "src/icons/refresh.svg?raw";
import sadUnicorn from "../../assets/unicorn_sad.svg";
import happyUnicorn from "../../assets/unicorn_happy.svg";
import scaredUnicorn from "../../assets/unicorn_scared.svg";

const SEARCH_QUERY_KEY = "searchQuery";
const SEARCH_PAGE_KEY = "searchPage";
const CONTENT_TO_DISPLAY_KEY = "display";
const FILTER_TAGS_KEY = "filterTags";
const FILTER_AUTHOR_KEY = "filterAuthors";
const SORT_KEY = "sort";

const DEFAULT_SORT = "newest";
const DEFAULT_CONTENT_TO_DISPLAY = "all";

interface SearchPageProps {
	unicornProfilePicMap: ProfilePictureMap;
}

const MAX_POSTS_PER_PAGE = 6;

export interface ServerReturnType {
	posts: PostInfo[];
	totalPosts: number;
	collections: ExtendedCollectionInfo[];
	totalCollections: number;
}

function SearchPageBase({ unicornProfilePicMap }: SearchPageProps) {
	const { urlParams, pushState } = useSearchParams();

	/**
	 * Derive state and setup for search
	 */
	const setSearch = useCallback(
		(str: string) => {
			pushState({ key: SEARCH_QUERY_KEY, val: str });
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
			if (!str) {
				// Remove tags and authors when no value is present
				pushState({ key: FILTER_TAGS_KEY, val: undefined });
				pushState({ key: FILTER_AUTHOR_KEY, val: undefined });
			}
		},
		[urlParams],
	);

	const search = useMemo(() => urlParams.get(SEARCH_QUERY_KEY), [urlParams]);

	const [debouncedSearch, immediatelySetDebouncedSearch] = useDebouncedValue(
		search,
		500,
	);

	/**
	 * Fetch data
	 */
	const enabled = !!debouncedSearch;

	const { isLoading, isFetching, isError, error, data, refetch } = useQuery({
		queryFn: ({ signal }) => {
			// Analytics go brr
			plausible &&
				plausible("search", { props: { searchVal: debouncedSearch } });

			return fetch(`/api/search?query=${debouncedSearch}`, {
				signal: signal,
				method: "GET",
			}).then((res) => {
				if (!res.ok) {
					return res.text().then((text) => Promise.reject(text));
				}
				return res.json() as Promise<ServerReturnType>;
			});
		},
		queryKey: ["search", debouncedSearch],
		initialData: {
			posts: [],
			totalPosts: 0,
			collections: [],
			totalCollections: 0,
		} as ServerReturnType,
		refetchOnWindowFocus: false,
		retry: false,
		enabled,
	});

	useEffect(() => {
		if (error) {
			console.error("There was an error", { error });
		}
	}, [error]);

	const isContentLoading = isLoading || isFetching;

	/**
	 * Derived state
	 */
	const page = useMemo(
		() => Number(urlParams.get(SEARCH_PAGE_KEY) || "1"),
		[urlParams],
	);

	// Setup selected unicorns
	const selectedUnicorns = useMemo(() => {
		const urlVal = urlParams.get(FILTER_AUTHOR_KEY);
		if (!urlVal || urlVal === "") return [];
		return urlVal.split(",").filter(Boolean);
	}, [urlParams]);

	const setSelectedUnicorns = useCallback(
		(sort: string[]) => {
			pushState({ key: FILTER_AUTHOR_KEY, val: sort.toString() });
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
		},
		[urlParams],
	);

	// Setup tags
	const selectedTags = useMemo(() => {
		const urlVal = urlParams.get(FILTER_TAGS_KEY);
		if (!urlVal || urlVal === "") return [];
		return urlVal.split(",").filter(Boolean);
	}, [urlParams]);

	const setSelectedTags = useCallback(
		(sort: string[]) => {
			pushState({ key: FILTER_TAGS_KEY, val: sort.toString() });
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
		},
		[urlParams],
	);

	// Setup content to display
	const contentToDisplay = useMemo(() => {
		const urlVal = urlParams.get(CONTENT_TO_DISPLAY_KEY);
		const isValid = ["all", "articles", "collections"].includes(urlVal);
		if (isValid) return urlVal as "all" | "articles" | "collections";
		return DEFAULT_CONTENT_TO_DISPLAY;
	}, [urlParams]);

	const setContentToDisplay = useCallback(
		(sort: "all" | "articles" | "collections") => {
			pushState({ key: CONTENT_TO_DISPLAY_KEY, val: sort });
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
		},
		[urlParams],
	);

	const showArticles =
		contentToDisplay === "all" || contentToDisplay === "articles";

	const showCollections =
		contentToDisplay === "all" || contentToDisplay === "collections";

	// Setup sort
	const sort = useMemo(
		() =>
			urlParams.get(SORT_KEY) === "newest"
				? "newest"
				: "oldest" ?? DEFAULT_SORT,
		[urlParams],
	);

	const setSort = useCallback(
		(sort: "newest" | "oldest") => {
			pushState({ key: SORT_KEY, val: sort });
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
		},
		[urlParams],
	);

	/**
	 * Filter and sort posts
	 */
	const filteredAndSortedPosts = useMemo(() => {
		return [...data.posts]
			.sort(
				(a, b) =>
					(sort === "newest" ? -1 : 1) *
					(new Date(a.published).getTime() - new Date(b.published).getTime()),
			)
			.filter((post) => {
				if (
					selectedTags.length > 0 &&
					!post.tags.some((tag) => selectedTags.includes(tag))
				) {
					return false;
				}

				if (
					selectedUnicorns.length > 0 &&
					!post.authors.some((unicorn) => selectedUnicorns.includes(unicorn))
				) {
					return false;
				}

				return true;
			});
	}, [data, page, sort, selectedUnicorns, selectedTags]);

	/**
	 * Paginate posts
	 */
	const posts = useMemo(() => {
		return filteredAndSortedPosts.slice(
			(page - 1) * MAX_POSTS_PER_PAGE,
			page * MAX_POSTS_PER_PAGE,
		);
	}, [filteredAndSortedPosts, page]);

	/**
	 * Calculate the last page based on the number of posts.
	 */
	const lastPage = useMemo(
		() => Math.ceil(filteredAndSortedPosts.length / MAX_POSTS_PER_PAGE),
		[filteredAndSortedPosts],
	);

	/**
	 * Styles for header bar
	 */
	const { size, setEl } = useElementSize();

	useLayoutEffect(() => {
		const header = document.querySelector("#header-bar") as HTMLElement;
		setEl(header);
	}, []);

	const headerHeight = size.height;

	const [isFilterDialogOpen, setFilterIsDialogOpen] = useState(false);

	const noResults =
		enabled &&
		!isContentLoading &&
		posts.length === 0 &&
		showArticles &&
		data.collections.length === 0 &&
		showCollections;

	return (
		<div className={style.fullPageContainer} role="search">
			<FilterDisplay
				isFilterDialogOpen={isFilterDialogOpen}
				setFilterIsDialogOpen={setFilterIsDialogOpen}
				unicornProfilePicMap={unicornProfilePicMap}
				collections={data.collections}
				posts={data.posts}
				selectedTags={selectedTags}
				setSelectedTags={setSelectedTags}
				selectedAuthorIds={selectedUnicorns}
				setSelectedAuthorIds={setSelectedUnicorns}
				sort={sort}
				setSort={setSort}
				desktopStyle={{
					height: `calc(100vh - ${headerHeight}px)`,
					top: headerHeight,
					position: "sticky",
				}}
				searchString={search}
			/>
			<div className={style.mainContents}>
				<SearchTopbar
					onSearch={(val) => immediatelySetDebouncedSearch(val)}
					search={search}
					setSearch={setSearch}
					setContentToDisplay={setContentToDisplay}
					contentToDisplay={contentToDisplay}
					setSort={setSort}
					sort={sort}
					setFilterIsDialogOpen={setFilterIsDialogOpen}
				/>
				{!isError && isContentLoading && (
					<p className={"text-style-headline-1"}>Loading...</p>
				)}
				{!isError && noResults && (
					<SearchHero
						imageSrc={sadUnicorn.src}
						imageAlt={""}
						title={"No results found..."}
						description={"Please adjust your query or your active filters!"}
					/>
				)}
				{isError && (
					<SearchHero
						imageSrc={scaredUnicorn.src}
						imageAlt={""}
						title={"There was an error fetching your search results."}
						description={"Please adjust your query or try again."}
						buttons={
							<LargeButton
								onClick={() => refetch()}
								leftIcon={<span dangerouslySetInnerHTML={{ __html: retry }} />}
							>
								Retry
							</LargeButton>
						}
					/>
				)}
				{!enabled && (
					<SearchHero
						imageSrc={happyUnicorn.src}
						imageAlt={""}
						title={"What would you like to find?"}
						description={
							"Search for your favorite framework or most loved language; we'll share what we know."
						}
					/>
				)}
				{enabled &&
					!isContentLoading &&
					showCollections &&
					Boolean(data.collections.length) && (
						<Fragment>
							<SubHeader
								tag="h1"
								text="Collections"
								data-testid="collections-header"
							/>
							<div className={style.collectionsGrid}>
								{data.collections.map((collection) => (
									<CollectionCard
										unicornProfilePicMap={unicornProfilePicMap}
										collection={collection}
									/>
								))}
							</div>
						</Fragment>
					)}
				{enabled &&
					!isContentLoading &&
					showArticles &&
					Boolean(data.posts.length) && (
						<Fragment>
							<SubHeader
								tag="h1"
								text="Articles"
								data-testid="articles-header"
							/>
							<PostCardGrid
								listAriaLabel={"List of search result posts"}
								postsToDisplay={posts}
								unicornProfilePicMap={unicornProfilePicMap}
							/>
							<Pagination
								testId="pagination"
								softNavigate={(href) => {
									pushState(href);
								}}
								page={{
									currentPage: page,
									lastPage: lastPage,
								}}
								getPageHref={(pageNum) => {
									const pageParams = new URLSearchParams(urlParams);
									pageParams.set(SEARCH_PAGE_KEY, pageNum.toString());
									return `${window.location.pathname}?${pageParams.toString()}`;
								}}
							/>
						</Fragment>
					)}
			</div>
		</div>
	);
}

const queryClient = new QueryClient();

export default function SearchPage(props: SearchPageProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<SearchPageBase {...props} />
		</QueryClientProvider>
	);
}
