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
import { PostCard } from "components/post-card/post-card";
import { useSearchParams } from "./use-search-params";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { useDebouncedValue } from "./use-debounced-value";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { SearchInput } from "components/input/input";
import { Button, IconOnlyButton } from "components/button/button";
import forward from "src/icons/arrow_right.svg?raw";

import style from "./search-page.module.scss";
import { PostCardGrid } from "components/post-card/post-card-grid";
import { SubHeader } from "components/subheader/subheader";
import { Fragment } from "preact";
import { ExtendedCollectionInfo } from "types/CollectionInfo";
import { CollectionCard } from "components/collection-card/collection-card";
import { FilterDisplay } from "./components/filter-display";
import { useElementSize } from "../../hooks/use-element-size";
import filter from "src/icons/filter.svg?raw";

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

interface ServerReturnType {
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
		},
		[urlParams]
	);

	const search = useMemo(() => urlParams.get(SEARCH_QUERY_KEY), [urlParams]);

	const [debouncedSearch, immediatelySetDebouncedSearch] = useDebouncedValue(
		search,
		500
	);

	/**
	 * Fetch data
	 */
	const enabled = !!debouncedSearch;

	const { isLoading, isFetching, isError, error, data } = useQuery({
		queryFn: ({ signal }) =>
			fetch(`/api/search?query=${debouncedSearch}`, {
				signal: signal,
			}).then((res) => res.json() as Promise<ServerReturnType>),
		queryKey: ["search", debouncedSearch],
		initialData: {
			posts: [],
			totalPosts: 0,
			collections: [],
			totalCollections: 0,
		} as ServerReturnType,
		refetchOnWindowFocus: false,
		enabled,
	});

	const isContentLoading = isLoading || isFetching;

	/**
	 * Derived state
	 */
	const page = useMemo(
		() => Number(urlParams.get(SEARCH_PAGE_KEY) || "1"),
		[urlParams]
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
		[urlParams]
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
		[urlParams]
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
		[urlParams]
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
		[urlParams]
	);

	const setSort = useCallback(
		(sort: "newest" | "oldest") => {
			pushState({ key: SORT_KEY, val: sort });
			pushState({ key: SEARCH_PAGE_KEY, val: undefined }); // reset to page 1
		},
		[urlParams]
	);

	/**
	 * Filter and sort posts
	 */
	const filteredAndSortedPosts = useMemo(() => {
		return [...data.posts]
			.sort(
				(a, b) =>
					(sort === "newest" ? -1 : 1) *
					(new Date(a.published).getTime() - new Date(b.published).getTime())
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
	 * Calculate the last page based on the number of posts.
	 */
	const lastPage = useMemo(
		() => Math.ceil(filteredAndSortedPosts.length / MAX_POSTS_PER_PAGE),
		[data]
	);

	/**
	 * Paginate posts
	 */
	const posts = useMemo(() => {
		return filteredAndSortedPosts.slice(
			(page - 1) * MAX_POSTS_PER_PAGE,
			page * MAX_POSTS_PER_PAGE
		);
	}, [filteredAndSortedPosts, page]);

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

	return (
		<div className={style.fullPageContainer}>
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
			/>
			<div className={style.mainContents}>
				<div className={style.topBar}>
					<form
						className={style.searchbarRow}
						onSubmit={(e) => {
							e.preventDefault();
							immediatelySetDebouncedSearch(search);
						}}
					>
						<SearchInput
							class={style.searchbar}
							usedInPreact={true}
							value={search}
							onBlur={(e) => {
								const newVal = (e.target as HTMLInputElement).value;
								setSearch(newVal);
								immediatelySetDebouncedSearch(newVal);
							}}
							onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
						/>
						<IconOnlyButton
							class={style.searchButton}
							tag="button"
							type="submit"
							dangerouslySetInnerHTML={{ __html: forward }}
							children={null}
						/>
					</form>
					<div className={style.topBarDivider} />
					<div className={style.topBarButtonsContentToDisplay} role="group">
						<Button
							onClick={() => setContentToDisplay("all")}
							aria-selected={contentToDisplay === "all"}
							tag="button"
							variant={
								contentToDisplay === "all" ? "primary-emphasized" : "primary"
							}
						>
							All
						</Button>
						<Button
							onClick={() => setContentToDisplay("articles")}
							aria-selected={contentToDisplay === "articles"}
							tag="button"
							variant={
								contentToDisplay === "articles"
									? "primary-emphasized"
									: "primary"
							}
						>
							Articles
						</Button>
						<Button
							onClick={() => setContentToDisplay("collections")}
							aria-selected={contentToDisplay === "collections"}
							tag="button"
							variant={
								contentToDisplay === "collections"
									? "primary-emphasized"
									: "primary"
							}
						>
							Collections
						</Button>
					</div>
					<div className={style.topBarSmallTabletButtons}>
						<div role="group" className={style.topBarSmallTabletButtonsToggle}>
							<Button
								onClick={() => setSort("newest")}
								aria-selected={sort === "newest"}
								tag="button"
								variant={sort === "newest" ? "primary-emphasized" : "primary"}
							>
								Newest
							</Button>
							<Button
								onClick={() => setSort("oldest")}
								aria-selected={sort === "oldest"}
								tag="button"
								variant={sort === "oldest" ? "primary-emphasized" : "primary"}
							>
								Oldest
							</Button>
						</div>
						<IconOnlyButton onClick={() => setFilterIsDialogOpen(true)}>
							<span className={style.filterIconContainer} dangerouslySetInnerHTML={{ __html: filter }}></span>
						</IconOnlyButton>
					</div>
				</div>
				{isContentLoading && (
					<p className={"text-style-headline-1"}>Loading...</p>
				)}
				{isError && <p className={"text-style-headline-1"}>Error: {error}</p>}
				{!enabled && (
					<p className={"text-style-headline-1"}>Type something to search</p>
				)}
				{enabled && !isContentLoading && showCollections && (
					<Fragment>
						<SubHeader tag="h1" text="Collections" />
						<div className="grid grid-tablet-2 grid-desktopSmall-3">
							{data.collections.map((collection) => (
								<CollectionCard
									unicornProfilePicMap={unicornProfilePicMap}
									collection={collection}
								/>
							))}
						</div>
						{data.collections.length === 0 && (
							<p className="text-style-headline-3">No results found.</p>
						)}
					</Fragment>
				)}
				{enabled && !isContentLoading && showArticles && (
					<Fragment>
						<SubHeader tag="h1" text="Articles" />
						<PostCardGrid
							listAriaLabel={"List of search result posts"}
							postsToDisplay={posts}
							unicornProfilePicMap={unicornProfilePicMap}
						/>
						{posts.length === 0 && (
							<p className="text-style-headline-3">No results found.</p>
						)}
						<Pagination
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
