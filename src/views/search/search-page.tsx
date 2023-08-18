import "wicg-inert";

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
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
import {
	SEARCH_QUERY_KEY,
	SEARCH_PAGE_KEY,
	CONTENT_TO_DISPLAY_KEY,
	FILTER_TAGS_KEY,
	FILTER_AUTHOR_KEY,
	SORT_KEY,
} from "../../utils/search";
import { debounce } from "utils/debounce";

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

	const [search, _setSearch] = useState(
		() => urlParams.get(SEARCH_QUERY_KEY) ?? "",
	);

	/**
	 * Derive state and setup for search
	 */
	const setSearch = useMemo(() => {
		const updateUrl = debounce(
			(str: string, dontUpdateSearchURL = false) => {
				if (!dontUpdateSearchURL) {
					pushState({ key: SEARCH_QUERY_KEY, val: str });
				}
				pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
				if (!str) {
					// Remove tags and authors when no value is present
					pushState({ key: FILTER_TAGS_KEY, val: undefined });
					pushState({ key: FILTER_AUTHOR_KEY, val: undefined });
				}
			},
			500,
			false,
		);

		return (str: string, dontUpdateSearchURL = false) => {
			_setSearch(str);
			updateUrl(str);
		};
	}, [pushState]);

	const searchRef = useRef(search);
	searchRef.current = search;

	useEffect(() => {
		const urlSearchVal = urlParams.get(SEARCH_QUERY_KEY);
		if (urlSearchVal && urlSearchVal !== searchRef.current) {
			setSearch(urlSearchVal, true);
		}
	}, [urlParams, setSearch]);

	const [debouncedSearch, immediatelySetDebouncedSearch] = useDebouncedValue(
		search,
		500,
	);

	const resultsHeading = useRef<HTMLHeadingElement>();

	const onManualSubmit = useCallback(
		(str: string) => {
			immediatelySetDebouncedSearch(str);
			resultsHeading.current?.focus();
		},
		[immediatelySetDebouncedSearch],
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
	const sort = useMemo(() => {
		const results = urlParams.get(SORT_KEY);
		if (!results) return DEFAULT_SORT;
		return results === "newest" ? "newest" : "oldest";
	}, [urlParams]);

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

	const filteredAndSortedCollections = useMemo(() => {
		return [...data.collections]
			.sort(
				(a, b) =>
					(sort === "newest" ? -1 : 1) *
					(new Date(a.published).getTime() - new Date(b.published).getTime()),
			)
			.filter((collection) => {
				if (
					selectedTags.length > 0 &&
					!collection.tags.some((tag) => selectedTags.includes(tag))
				) {
					return false;
				}

				if (
					selectedUnicorns.length > 0 &&
					!collection.authors.some((unicorn) =>
						selectedUnicorns.includes(unicorn),
					)
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
		((posts.length === 0 && showArticles && !showCollections) ||
			(filteredAndSortedCollections.length === 0 &&
				showCollections &&
				!showArticles) ||
			(showCollections &&
				showArticles &&
				posts.length === 0 &&
				filteredAndSortedCollections.length === 0));

	const [isResultsFocused, setIsResultsFocused] = useState(false);

	return (
		<div className={style.fullPageContainer} role="search">
			<h1 className={"visually-hidden"}>Search</h1>
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
					overflow: "hidden",
				}}
				searchString={search}
			/>
			<div className={style.mainContents}>
				<SearchTopbar
					onSubmit={(val) => onManualSubmit(val)}
					onBlur={(val) => immediatelySetDebouncedSearch(val)}
					search={search}
					setSearch={setSearch}
					setContentToDisplay={setContentToDisplay}
					contentToDisplay={contentToDisplay}
					setSort={setSort}
					sort={sort}
					setFilterIsDialogOpen={setFilterIsDialogOpen}
				/>
				<h1
					ref={resultsHeading}
					className={`text-style-headline-1 ${style.results}`}
					tabIndex={-1}
					onFocus={() => setIsResultsFocused(true)}
					onBlur={() => setIsResultsFocused(false)}
					aria-live={isResultsFocused ? "polite" : undefined}
				>
					{isContentLoading ? (
						"Loading..."
					) : (
						<>
							There are {posts.length} articles and{" "}
							{filteredAndSortedCollections.length} collections in your search
						</>
					)}
				</h1>
				{!isError && isContentLoading && (
					<>
						<div className={style.loadingAnimationContainer}>
							<div className={style.loadingAnimation} />
							<p
								aria-live="polite"
								className={`text-style-headline-4 ${style.loadingText}`}
							>
								Fetching results...
							</p>
						</div>
					</>
				)}
				<div aria-live="assertive" aria-atomic="true">
					{!isError && !isContentLoading && noResults && (
						<SearchHero
							imageSrc={sadUnicorn.src}
							imageAlt={""}
							title={"No results found..."}
							description={"Please adjust your query or your active filters!"}
						/>
					)}
					{isError && !isContentLoading && (
						<SearchHero
							imageSrc={scaredUnicorn.src}
							imageAlt={""}
							title={"There was an error fetching your search results."}
							description={"Please adjust your query or try again."}
							buttons={
								<LargeButton
									onClick={() => refetch()}
									leftIcon={
										<span dangerouslySetInnerHTML={{ __html: retry }} />
									}
								>
									Retry
								</LargeButton>
							}
						/>
					)}
				</div>

				{!enabled && !isContentLoading && (
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
					Boolean(filteredAndSortedCollections.length) && (
						<Fragment>
							<SubHeader
								tag="h1"
								text="Collections"
								id="collections-header"
								data-testid="collections-header"
							/>
							<ul
								aria-labelledby="collections-header"
								role="list"
								className={style.collectionsGrid}
							>
								{filteredAndSortedCollections.map((collection) => (
									<li>
										<CollectionCard
											unicornProfilePicMap={unicornProfilePicMap}
											collection={collection}
										/>
									</li>
								))}
							</ul>
						</Fragment>
					)}
				{enabled &&
					!isContentLoading &&
					showArticles &&
					Boolean(posts.length) && (
						<Fragment>
							<SubHeader
								tag="h1"
								text="Articles"
								id="articles-header"
								data-testid="articles-header"
							/>
							<PostCardGrid
								aria-labelledby={"articles-header"}
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
