import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import { Pagination } from "components/pagination/pagination";
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
import { SortType } from "./components/types";
import { SearchResultCount } from "./components/search-result-count";
import { ServerReturnType } from "./types";
import { CollectionInfo } from "types/CollectionInfo";
import { isDefined } from "utils/is-defined";

const DEFAULT_SORT = "relevance";
const DEFAULT_CONTENT_TO_DISPLAY = "all";

interface SearchPageProps {
	unicornProfilePicMap: ProfilePictureMap;
}

const MAX_POSTS_PER_PAGE = 6;

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

	const resultsHeading = useRef<HTMLDivElement | null>(null);

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
			unicorns: {},
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
		(authors: string[]) => {
			pushState({ key: FILTER_AUTHOR_KEY, val: authors.toString() });
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
		(tags: string[]) => {
			pushState({ key: FILTER_TAGS_KEY, val: tags.toString() });
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
		},
		[urlParams],
	);

	// Setup content to display
	const contentToDisplay = useMemo(() => {
		const urlVal = urlParams.get(CONTENT_TO_DISPLAY_KEY);
		const isValid = ["all", "articles", "collections"].includes(String(urlVal));
		if (isValid) return urlVal as "all" | "articles" | "collections";
		return DEFAULT_CONTENT_TO_DISPLAY;
	}, [urlParams]);

	const setContentToDisplay = useCallback(
		(display: "all" | "articles" | "collections") => {
			pushState({ key: CONTENT_TO_DISPLAY_KEY, val: display });
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
		},
		[urlParams],
	);

	const unicornsMap = useMemo(() => {
		return new Map(Object.entries(data.unicorns));
	}, [data.unicorns]);

	const showArticles =
		contentToDisplay === "all" || contentToDisplay === "articles";

	const showCollections =
		contentToDisplay === "all" || contentToDisplay === "collections";

	// Setup sort
	const sort = useMemo(() => {
		const sort = urlParams.get(SORT_KEY) as SortType;
		if (sort === "relevance" || sort === "newest" || sort === "oldest")
			return sort;
		else return DEFAULT_SORT;
	}, [urlParams]);

	const setSort = useCallback(
		(sort: SortType) => {
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
			if (sort === "relevance") {
				pushState({ key: SORT_KEY, val: undefined });
				return;
			}
			pushState({ key: SORT_KEY, val: sort });
		},
		[urlParams],
	);

	/**
	 * Filter and sort posts
	 */
	const filteredAndSortedPosts = useMemo(() => {
		const posts = [...data.posts];
		if (sort && sort !== "relevance") {
			posts.sort(
				(a, b) =>
					(sort === "newest" ? -1 : 1) *
					(new Date(a.published).getTime() - new Date(b.published).getTime()),
			);
		}

		return posts.filter((post) => {
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

	const filteredAndSortedCollections: CollectionInfo[] = useMemo(() => {
		const collections = [...data.collections];

		if (sort && sort !== "relevance") {
			collections.sort(
				(a, b) =>
					(sort === "newest" ? -1 : 1) *
					(new Date(a.published).getTime() - new Date(b.published).getTime()),
			);
		}

		return collections.filter((collection) => {
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

	const numberOfCollections = showCollections
		? filteredAndSortedCollections.length
		: 0;

	const numberOfPosts = showArticles ? filteredAndSortedPosts.length : 0;

	return (
		<main
			className={style.fullPageContainer}
			data-hide-sidebar={!search}
		>
			<h1 className={"visually-hidden"}>Search</h1>
			<FilterDisplay
				isFilterDialogOpen={isFilterDialogOpen}
				setFilterIsDialogOpen={setFilterIsDialogOpen}
				unicornProfilePicMap={unicornProfilePicMap}
				collections={data.collections}
				posts={data.posts}
				unicornsMap={unicornsMap}
				selectedTags={selectedTags}
				setSelectedTags={setSelectedTags}
				selectedAuthorIds={selectedUnicorns}
				setSelectedAuthorIds={setSelectedUnicorns}
				sort={sort}
				setSort={setSort}
				setContentToDisplay={setContentToDisplay}
				contentToDisplay={contentToDisplay}
				desktopStyle={{
					height: `calc(100vh - ${headerHeight}px)`,
					top: headerHeight,
					position: "sticky",
					// this should be overflow: clip; to prevent the browser scrolling within the element when a filter checkbox is focused:
					// https://stackoverflow.com/q/75419337
					// https://github.com/unicorn-utterances/unicorn-utterances/issues/653
					overflow: "clip",
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
					headerHeight={headerHeight}
				/>
				<section className={style.mainContentsInner}>
					{/* aria-live cannot be on an element that is programmatically removed
				or added via JSX, instead it has to listen to changes in DOM somehow */}
					<div
						aria-live={"polite"}
						aria-atomic="true"
						className={style.passThru}
					>
						{!isContentLoading &&
							(!!numberOfCollections || !!numberOfPosts) && (
								<SearchResultCount
									ref={resultsHeading}
									numberOfCollections={numberOfCollections}
									numberOfPosts={numberOfPosts}
								/>
							)}
						{!isError && isContentLoading && (
							<>
								<div className={style.loadingAnimationContainer}>
									<div className={style.loadingAnimation} />
									<p className={`text-style-headline-4 ${style.loadingText}`}>
										Fetching results...
									</p>
								</div>
							</>
						)}
					</div>
					<div
						aria-live="assertive"
						aria-atomic="true"
						className={style.passThru}
					>
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
									tag="h2"
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
												authors={collection.authors.map(id => unicornsMap.get(id)).filter(isDefined)}
												headingTag="h3"
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
									tag="h2"
									text="Articles"
									id="articles-header"
									data-testid="articles-header"
								/>
								<PostCardGrid
									aria-labelledby={"articles-header"}
									postsToDisplay={posts}
									postAuthors={unicornsMap}
									postHeadingTag="h3"
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
										return `${
											window.location.pathname
										}?${pageParams.toString()}`;
									}}
								/>
							</Fragment>
						)}
				</section>
			</div>
		</main>
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
