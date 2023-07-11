import { useCallback, useLayoutEffect, useMemo } from "preact/hooks";
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

const SEARCH_QUERY_KEY = "searchQuery";
const SEARCH_PAGE_KEY = "searchPage";

interface SearchPageProps {
	unicornProfilePicMap: ProfilePictureMap;
}

const MAX_POSTS_PER_PAGE = 6;

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

	const { isLoading, isInitialLoading, isFetching, isError, error, data } =
		useQuery({
			queryFn: ({ signal }) =>
				fetch(`/api/search?query=${debouncedSearchVal}`, {
					signal: signal,
				}).then(
					(res) =>
						res.json() as Promise<{ posts: PostInfo[]; totalPosts: number }>
				),
			queryKey: ["search", debouncedSearchVal],
			initialData: { posts: [], totalPosts: 0 },
			refetchOnWindowFocus: false,
		});

	const lastPage = useMemo(
		() => Math.ceil(data.totalPosts / MAX_POSTS_PER_PAGE),
		[data]
	);

	useLayoutEffect(() => {
		pushState({ key: SEARCH_PAGE_KEY, val: "1" });
	}, [data]);

	const posts = useMemo(
		() =>
			data.posts.slice(
				(page - 1) * MAX_POSTS_PER_PAGE,
				page * MAX_POSTS_PER_PAGE
			),
		[data, page]
	);

	return (
		<div>
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
							aria-selected="true"
							tag="button"
							variant="primary-emphasized"
						>
							All
						</Button>
						<Button aria-selected="false" tag="button">
							Articles
						</Button>
						<Button aria-selected="false" tag="button">
							Collections
						</Button>
					</div>
				</div>
				{(isLoading || isInitialLoading || isFetching) && <h1>Loading...</h1>}
				<SubHeader tag="h1" text="Articles" />
				<PostCardGrid
					listAriaLabel={"List of search result posts"}
					postsToDisplay={posts}
					unicornProfilePicMap={unicornProfilePicMap}
				/>
				<div>{isError && <div>Error: {error}</div>}</div>
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
