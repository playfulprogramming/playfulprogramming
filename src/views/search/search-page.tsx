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

import style from "./search-page.module.scss";
import { PostCardGrid } from "components/post-card/post-card-grid";
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
	SearchQuery,
	serializeParams,
	deserializeParams,
	DisplayContentType,
	SortType,
	SearchFiltersData,
	PAGE_KEY,
} from "./search";
import { SearchResultCount } from "./components/search-result-count";
import { isDefined } from "utils/is-defined";
import { SearchProvider, useSearch } from "./services";
import {
	MAX_COLLECTIONS_PER_PAGE,
	MAX_POSTS_PER_PAGE,
	// HYBRID_SEARCH_ACTIVATION_THRESHOLD,
} from "./constants";
import { useFilterState } from "./use-filter-state";

function usePersistedEmptyRef<T extends object>(value: T) {
	const ref = useRef<T>();
	return useMemo(() => {
		if (Object.entries(value).length) {
			ref.current = value;
			return value;
		}
		return ref.current ?? value;
	}, [value]);
}

const fetchSearchFilters = async ({ signal }: { signal: AbortSignal }) => {
	return fetch("/searchFilters.json", { signal, method: "GET" }).then(
		async (res) => {
			if (!res.ok) {
				return Promise.reject(await res.text());
			}
			return res.json() as Promise<SearchFiltersData>;
		},
	);
};

export function SearchPageBase({ siteTitle }: RootSearchPageProps) {
	const [query, setQueryState] = useSearchParams<SearchQuery>(
		serializeParams,
		deserializeParams,
		(query): string => {
			if (query.searchQuery === "*") {
				return `Search all | ${siteTitle}`;
			} else if (query.searchQuery) {
				return `${query.searchQuery} | ${siteTitle}`;
			}
			return `Search | ${siteTitle}`;
		},
	);

	const setQuery = useCallback(
		(
			updater: (prevQuery: SearchQuery) => Partial<SearchQuery> | SearchQuery,
		) => {
			setQueryState((prevQuery) => {
				const queryUpdates = updater(prevQuery);
				if (queryUpdates === prevQuery) {
					return prevQuery;
				}

				const queryToSet: SearchQuery = {
					...prevQuery,
					...queryUpdates,
				};

				if (queryToSet.searchQuery.length === 0) {
					// Remove tags and authors when no value is present
					queryToSet.filterTags = [];
					queryToSet.filterAuthors = [];
				}

				return queryToSet;
			});
		},
		[setQueryState],
	);

	const resultsHeading = useRef<HTMLDivElement | null>(null);

	const setSearch = useCallback(
		(str: string) =>
			setQuery((prevQuery) => {
				if (prevQuery.searchQuery === str) {
					return prevQuery;
				}

				return {
					searchQuery: str,
					page: 1,
				};
			}),
		[setQuery],
	);

	const onManualSubmit = useCallback(
		(str: string) => {
			setQuery(() => ({ searchQuery: str, page: 1 }));
			resultsHeading.current?.focus();
		},
		[setQuery],
	);

	/**
	 * Fetch data
	 */
	const enabled = !!query.searchQuery;

	const {
		isLoading: isLoadingPeople,
		isFetching: isFetchingPeople,
		isError: isErrorPeople,
		error: errorPeople,
		data: people,
	} = useQuery({
		queryFn: fetchSearchFilters,
		queryKey: ["people"],
		initialData: {
			people: [],
			tags: [],
		} as SearchFiltersData,
		refetchOnWindowFocus: false,
		retry: false,
		enabled,
	});

	const { searchForTerm } = useSearch();
	const fetchSearchQuery = useCallback(
		({
			signal,
			queryKey: [_, query],
		}: {
			signal: AbortSignal;
			queryKey: [string, SearchQuery];
		}) => {
			// Analytics go brr
			if (window.plausible) {
				window.plausible("search", { props: { searchVal: query.searchQuery } });
			}

			return searchForTerm(query, signal);
		},
		[searchForTerm],
	);

	const {
		isLoading: isLoadingData,
		isFetching: isFetchingData,
		isError: isErrorData,
		error: errorData,
		data,
		refetch,
	} = useQuery({
		queryFn: fetchSearchQuery,
		queryKey: ["search", query],
		initialData: {
			posts: [],
			totalPosts: 0,
			collections: [],
			totalCollections: 0,
			tags: {},
			authors: {},
		},
		refetchOnWindowFocus: false,
		retry: false,
		enabled,
	});

	const isWildcardSearch = query.searchQuery === "*";
	// If the search is a wildcard, we want to use *every* tag/person filter (the search API returns a limited amount)
	const tagCounts = usePersistedEmptyRef(
		useMemo(() => {
			const tags: Array<[string, number]> = isWildcardSearch
				? people.tags.map((tag) => [tag.id, tag.totalPostCount])
				: Object.entries(data.tags);
			const filteredTags = tags.filter(([_, count]) => count >= 3);

			return Object.fromEntries(filteredTags.length > 5 ? filteredTags : tags);
		}, [isWildcardSearch, data.tags, people.tags]),
	);
	const authorCounts = usePersistedEmptyRef(
		isWildcardSearch
			? Object.fromEntries(
					people.people.map((person) => [person.id, person.totalPostCount]),
				)
			: data.authors,
	);

	// if search term has more than a certain number of words, then use hybrid mode search for smart/AI searching capabilities
	// const isHybridSearch = useMemo(
	// 	() =>
	// 		query.searchQuery?.split(" ")?.filter((t) => t.trim() !== "")?.length >=
	// 		HYBRID_SEARCH_ACTIVATION_THRESHOLD,
	// 	[query.searchQuery],
	// );
	const isHybridSearch = useMemo(() => false, []);

	const isError = isErrorPeople || isErrorData;

	useEffect(() => {
		if (errorPeople) {
			console.error("There was an error", { error: errorPeople });
		}
	}, [errorPeople]);

	useEffect(() => {
		if (errorData) {
			console.error("There was an error", { error: errorData });
		}
	}, [errorData]);

	const isContentLoading =
		isLoadingData || isFetchingData || isLoadingPeople || isFetchingPeople;

	const filterState = useFilterState({
		tags: query.filterTags,
		authors: query.filterAuthors,
		setTags: useCallback(
			(tags: string[]) => {
				setQuery(() => ({
					filterTags: tags,
					page: 1, // Reset both page counters when changing filters
				}));
			},
			[setQuery],
		),
		setAuthors: useCallback(
			(authors: string[]) => {
				setQuery(() => ({
					filterAuthors: authors,
					page: 1, // Reset both page counters when changing filters
				}));
			},
			[setQuery],
		),
		setFilters: useCallback(
			(filters: Record<"tags" | "authors", string[]>) => {
				setQuery(() => ({
					filterTags: filters.tags,
					filterAuthors: filters.authors,
					page: 1, // Reset both page counters when changing filters
				}));
			},
			[setQuery],
		),
	});

	const setContentToDisplay = useCallback(
		(display: DisplayContentType) => {
			setQuery(() => ({
				display,
				page: 1, // Reset both page counters when changing filters
			}));
		},
		[setQuery],
	);

	const peopleMap = useMemo(() => {
		return new Map(people.people.map((person) => [person.id, person]));
	}, [people.people]);

	const showArticles = query.display === "articles";

	const showCollections = query.display === "collections";

	const setSort = useCallback(
		(sort: SortType) => {
			setQuery(() => ({
				sort,
				page: 1, // Reset both page counters when changing filters
			}));
		},
		[setQuery],
	);

	/**
	 * Calculate the last page based on the number of posts.
	 */
	const lastPage = useMemo(
		() =>
			Math.max(
				showCollections
					? Math.ceil(data.totalCollections / MAX_COLLECTIONS_PER_PAGE)
					: 0,
				showArticles ? Math.ceil(data.totalPosts / MAX_POSTS_PER_PAGE) : 0,
			),
		[showCollections, data.totalCollections, showArticles, data.totalPosts],
	);

	/**
	 * Styles for header bar
	 */
	const { size, setEl } = useElementSize();

	useLayoutEffect(() => {
		const header = document.querySelector("#header-bar") as HTMLElement;
		setEl(header);
	}, [setEl]);

	const headerHeight = size.height;

	const [isFilterDialogOpen, setFilterIsDialogOpen] = useState(false);

	const noResults =
		enabled &&
		!isContentLoading &&
		((data.posts.length === 0 && showArticles && !showCollections) ||
			(data.collections.length === 0 && showCollections && !showArticles) ||
			(showCollections &&
				showArticles &&
				data.posts.length === 0 &&
				data.collections.length === 0));

	return (
		<div
			className={style.fullPageContainer}
			data-hide-sidebar={!query.searchQuery}
		>
			<FilterDisplay
				isFilterDialogOpen={isFilterDialogOpen}
				setFilterIsDialogOpen={setFilterIsDialogOpen}
				tagCounts={tagCounts}
				authorCounts={authorCounts}
				peopleMap={peopleMap}
				filterState={filterState}
				sort={query.sort}
				setSort={setSort}
				setContentToDisplay={setContentToDisplay}
				contentToDisplay={query.display}
				desktopStyle={{
					height: `calc(100vh - ${headerHeight}px)`,
					top: headerHeight,
					position: "sticky",
					// this should be overflow: clip; to prevent the browser scrolling within the element when a filter checkbox is focused:
					// https://stackoverflow.com/q/75419337
					// https://github.com/playfulprogramming/playfulprogramming/issues/653
					overflow: "clip",
				}}
				searchString={query.searchQuery}
				isHybridSearch={isHybridSearch}
				numberOfPosts={isContentLoading ? null : data.totalPosts}
				numberOfCollections={isContentLoading ? null : data.totalCollections}
			/>
			<div className={style.mainContents}>
				<SearchTopbar
					onSubmit={onManualSubmit}
					onBlur={setSearch}
					search={query.searchQuery}
					setSearch={setSearch}
					setContentToDisplay={setContentToDisplay}
					contentToDisplay={query.display}
					setSort={setSort}
					sort={query.sort}
					setFilterIsDialogOpen={setFilterIsDialogOpen}
					headerHeight={headerHeight}
				/>
				<section className={style.mainContentsInner}>
					{/* aria-live cannot be on an element that is programmatically removed
				or added via JSX, instead it has to listen to changes in DOM somehow */}
					<div aria-live="polite" aria-atomic="true" className={style.passThru}>
						{!isContentLoading &&
							showCollections &&
							data.totalCollections > 0 && (
								<SearchResultCount
									ref={resultsHeading}
									numberOfCollections={data.totalCollections}
								/>
							)}
						{!isContentLoading && showArticles && data.totalPosts > 0 && (
							<SearchResultCount
								ref={resultsHeading}
								numberOfPosts={data.totalPosts}
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
						{isError && (
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
						Boolean(data.collections.length) && (
							<Fragment>
								<h2
									id="collections-header"
									data-testid="collections-header"
									class="visually-hidden"
								>
									Collections
								</h2>
								<ul
									aria-labelledby="collections-header"
									role="list"
									className={style.collectionsGrid}
								>
									{data.collections.map((collection) => (
										<CollectionCard
											key={collection.slug}
											collection={collection}
											authors={collection.authors
												.map((id) => peopleMap.get(`${id}`))
												.filter(isDefined)}
											headingTag="h3"
										/>
									))}
								</ul>
							</Fragment>
						)}

					{enabled &&
						!isContentLoading &&
						showArticles &&
						Boolean(data.posts.length) && (
							<Fragment>
								<h2
									id="articles-header"
									data-testid="articles-header"
									class="visually-hidden"
								>
									Articles
								</h2>
								<PostCardGrid
									aria-labelledby={"articles-header"}
									postsToDisplay={data.posts}
									postAuthors={peopleMap}
									postHeadingTag="h3"
									expanded
								/>
							</Fragment>
						)}
					{enabled &&
						!isContentLoading &&
						(Boolean(data.posts.length) || Boolean(data.collections.length)) &&
						!isHybridSearch && (
							<Pagination
								divClass={style.pagination}
								testId="pagination"
								softNavigate={(_href, pageNum) => {
									window.scrollTo(0, 0);
									setQuery(() => ({
										page: pageNum,
									}));
								}}
								page={{
									currentPage: query.page,
									lastPage,
								}}
								getPageHref={(pageNum) => {
									const pageParams = new URLSearchParams(
										window.location.search,
									);
									pageParams.set(PAGE_KEY, pageNum.toString());
									return `${window.location.pathname}?${pageParams.toString()}`;
								}}
							/>
						)}
				</section>
			</div>
		</div>
	);
}

const queryClient = new QueryClient();

interface RootSearchPageProps {
	siteTitle: string;
}
export default function SearchPage({ siteTitle }: RootSearchPageProps) {
	return (
		<SearchProvider>
			<QueryClientProvider client={queryClient}>
				<SearchPageBase siteTitle={siteTitle} />
			</QueryClientProvider>
		</SearchProvider>
	);
}
