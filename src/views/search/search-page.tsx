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
	SEARCH_PAGE_KEY,
	SearchQuery,
	serializeParams,
	deserializeParams,
	DisplayContentType,
	SortType,
} from "./search";
import { SearchResultCount } from "./components/search-result-count";
import { isDefined } from "utils/is-defined";
import { OramaClientProvider, useOramaSearch } from "./orama";
import { PersonInfo } from "types/PersonInfo";

const MAX_POSTS_PER_PAGE = 6;

export function SearchPageBase() {
	const [query, setQueryState] = useSearchParams<SearchQuery>(
		serializeParams,
		deserializeParams,
	);

	const [debouncedQuery, immediatelySetDebouncedQuery] = useDebouncedValue(query, 500);

	const search = query.searchQuery ?? "";

	const setQuery = useCallback(
		(newQuery: SearchQuery, immediate?: boolean) => {
			if (!newQuery.searchQuery) {
				// Remove tags and authors when no value is present
				newQuery.filterTags = [];
				newQuery.filterAuthors = [];
			}

			setQueryState(newQuery);
			if (immediate) {
				immediatelySetDebouncedQuery(newQuery);
			}
		},
		[query, setQueryState],
	);

	/**
	 * Derive state and setup for search
	 */
	const setSearch = useCallback(
		(str: string, immediate?: boolean) => {
			const newQuery = {
				...query,
				searchQuery: str,
				searchPage: 1,
			};

			setQuery(newQuery, immediate);
		},
		[query, setQuery],
	);

	const resultsHeading = useRef<HTMLDivElement | null>(null);

	const onManualSubmit = useCallback(
		(str: string) => {
			setSearch(str, true);
			resultsHeading.current?.focus();
		},
		[immediatelySetDebouncedQuery],
	);

	/**
	 * Fetch data
	 */
	const enabled = !!debouncedQuery.searchQuery;

	const { searchForTerm } = useOramaSearch();

	const {
		isLoading: isLoadingPeople,
		isFetching: isFetchingPeople,
		isError: isErrorPeople,
		error: errorPeople,
		data: people,
	} = useQuery({
		queryFn: async ({ signal }) => {
			return fetch("/peopleIndex.json", { signal, method: "GET" }).then(
				(res) => {
					if (!res.ok) {
						return res.text().then((text) => Promise.reject(text));
					}
					return res.json() as Promise<{ people: PersonInfo[] }>;
				},
			);
		},
		queryKey: ["people"],
		initialData: {
			people: [] as PersonInfo[],
		},
		refetchOnWindowFocus: false,
		retry: false,
		enabled,
	});

	const {
		isLoading: isLoadingData,
		isFetching: isFetchingData,
		isError: isErrorData,
		error: errorData,
		data,
		refetch,
	} = useQuery({
		queryFn: ({ signal }) => {
			// Analytics go brr
			plausible &&
				plausible("search", { props: { searchVal: debouncedQuery.searchQuery } });

			return searchForTerm(debouncedQuery, signal);
		},
		queryKey: ["search", debouncedQuery],
		initialData: {
			posts: [],
			totalPosts: 0,
			collections: [],
			totalCollections: 0,
		},
		refetchOnWindowFocus: false,
		retry: false,
		enabled,
	});

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

	const setSelectedPeople = useCallback(
		(authors: string[]) => {
			setQuery({
				...query,
				filterAuthors: authors,
				searchPage: 1, // reset to page 1
			}, true);
		},
		[query, setQuery],
	);

	const setSelectedTags = useCallback(
		(tags: string[]) => {
			setQuery({
				...query,
				filterTags: tags,
				searchPage: 1, // reset to page 1
			}, true);
		},
		[query, setQuery],
	);

	const setContentToDisplay = useCallback(
		(display: DisplayContentType) => {
			setQuery({
				...query,
				display: display,
				searchPage: 1, // reset to page 1
			}, true);
		},
		[query, setQuery],
	);

	const peopleMap = useMemo(() => {
		return new Map(people.people.map((person) => [person.id, person]));
	}, [people.people]);

	const showArticles = query.display === "all" || query.display === "articles";

	const showCollections =
		query.display === "all" || query.display === "collections";

	const setSort = useCallback(
		(sort: SortType) => {
			setQuery({
				...query,
				sort: sort,
				searchPage: 1, // reset to page 1
			}, true);
		},
		[query, setQuery],
	);

	/**
	 * Calculate the last page based on the number of posts.
	 */
	const lastPage = useMemo(
		() => Math.ceil(data.totalPosts / MAX_POSTS_PER_PAGE),
		[data.totalPosts],
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
		((data.posts.length === 0 && showArticles && !showCollections) ||
			(data.collections.length === 0 &&
				showCollections &&
				!showArticles) ||
			(showCollections &&
				showArticles &&
				data.posts.length === 0 &&
				data.collections.length === 0));

	const numberOfCollections = showCollections
		? data.totalCollections
		: 0;

	const numberOfPosts = showArticles ? data.totalPosts : 0;

	return (
		<main className={style.fullPageContainer} data-hide-sidebar={!search}>
			<h1 className={"visually-hidden"}>Search</h1>
			<FilterDisplay
				isFilterDialogOpen={isFilterDialogOpen}
				setFilterIsDialogOpen={setFilterIsDialogOpen}
				collections={data.collections}
				posts={data.posts}
				peopleMap={peopleMap}
				selectedTags={query.filterTags}
				setSelectedTags={setSelectedTags}
				selectedAuthorIds={query.filterAuthors}
				setSelectedAuthorIds={setSelectedPeople}
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
				searchString={search}
			/>
			<div className={style.mainContents}>
				<SearchTopbar
					onSubmit={(val) => onManualSubmit(val)}
					onBlur={(val) => setSearch(val, true)}
					search={search}
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
									{data.collections.map((collection) => (
										<li>
											<CollectionCard
												collection={collection}
												authors={collection.authors
													.map((id) => peopleMap.get(id))
													.filter(isDefined)}
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
						Boolean(data.posts.length) && (
							<Fragment>
								<SubHeader
									tag="h2"
									text="Articles"
									id="articles-header"
									data-testid="articles-header"
								/>
								<PostCardGrid
									aria-labelledby={"articles-header"}
									postsToDisplay={data.posts}
									postAuthors={peopleMap}
									postHeadingTag="h3"
								/>
								<Pagination
									testId="pagination"
									softNavigate={(_href, pageNum) => {
										setQuery({
											...query,
											searchPage: pageNum,
										});
									}}
									page={{
										currentPage: query.searchPage,
										lastPage: lastPage,
									}}
									getPageHref={(pageNum) => {
										const pageParams = new URLSearchParams(
											window.location.search,
										);
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

export default function SearchPage() {
	return (
		<OramaClientProvider>
			<QueryClientProvider client={queryClient}>
				<SearchPageBase />
			</QueryClientProvider>
		</OramaClientProvider>
	);
}
