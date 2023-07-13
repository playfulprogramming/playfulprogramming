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
import { FilterSidebar } from "./components/filter-sidebar";

const SEARCH_QUERY_KEY = "searchQuery";
const SEARCH_PAGE_KEY = "searchPage";

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

	const search = useCallback(
		(str: string) => {
			pushState({ key: SEARCH_QUERY_KEY, val: str });
		},
		[urlParams]
	);

	const searchVal = useMemo(() => urlParams.get(SEARCH_QUERY_KEY), [urlParams]);

	const page = useMemo(
		() => Number(urlParams.get(SEARCH_PAGE_KEY) || "1"),
		[urlParams]
	);

	const [debouncedSearchVal, immediatelySetDebouncedSearchVal] =
		useDebouncedValue(searchVal, 500);

	const enabled = !!debouncedSearchVal;

	const { isInitialLoading, isLoading, isFetching, isError, error, data } =
		useQuery({
			queryFn: ({ signal }) =>
				fetch(`/api/search?query=${debouncedSearchVal}`, {
					signal: signal,
				}).then((res) => res.json() as Promise<ServerReturnType>),
			queryKey: ["search", debouncedSearchVal],
			initialData: {
				posts: [],
				totalPosts: 0,
				collections: [],
				totalCollections: 0,
			} as ServerReturnType,
			refetchOnWindowFocus: false,
			enabled,
		});

	const lastPage = useMemo(
		() => Math.ceil(data.totalPosts / MAX_POSTS_PER_PAGE),
		[data]
	);

	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [selectedUnicorns, setSelectedUnicorns] = useState<string[]>([]);

	const [sort, setSort] = useState<"newest" | "oldest">("newest");

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

	let dataChangedCount = useRef(0);

	useEffect(() => {
		dataChangedCount.current++;
		// One for initial load, one for when the search query changes.
		// Or rather, "One for the money, two for the show"
		if (dataChangedCount.current <= 2) return;
		pushState({ key: SEARCH_PAGE_KEY, val: "1" });
	}, [filteredAndSortedPosts]);

	const posts = useMemo(() => {
		return filteredAndSortedPosts.slice(
			(page - 1) * MAX_POSTS_PER_PAGE,
			page * MAX_POSTS_PER_PAGE
		);
	}, [filteredAndSortedPosts, page]);

	const [contentToDisplay, setContentToDisplay] = useState<
		"all" | "articles" | "collections"
	>("all");

	const showArticles =
		contentToDisplay === "all" || contentToDisplay === "articles";

	const showCollections =
		contentToDisplay === "all" || contentToDisplay === "collections";

	const isContentLoading = isLoading || isFetching;

	return (
		<div className={style.fullPageContainer}>
			<FilterSidebar
				unicornProfilePicMap={unicornProfilePicMap}
				collections={data.collections}
				posts={data.posts}
				selectedTags={selectedTags}
				setSelectedTags={setSelectedTags}
				selectedAuthorIds={selectedUnicorns}
				setSelectedAuthorIds={setSelectedUnicorns}
				sort={sort}
				setSort={setSort}
			/>
			<div className={style.mainContents}>
				<div className={style.topBar}>
					<form
						className={style.searchbarRow}
						onSubmit={(e) => {
							e.preventDefault();
							immediatelySetDebouncedSearchVal(searchVal);
						}}
					>
						<SearchInput
							class={style.searchbar}
							usedInPreact={true}
							value={searchVal}
							onBlur={(e) => {
								const newVal = (e.target as HTMLInputElement).value;
								search(newVal);
								immediatelySetDebouncedSearchVal(newVal);
							}}
							onInput={(e) => search((e.target as HTMLInputElement).value)}
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
					<div className={style.topBarButtons} role="group">
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
								urlParams.set(SEARCH_PAGE_KEY, pageNum.toString());
								return `${window.location.pathname}?${urlParams.toString()}`;
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
