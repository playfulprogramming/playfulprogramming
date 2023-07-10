import { useCallback, useMemo } from "preact/hooks";
import { Pagination } from "components/pagination/pagination";
import { PostInfo } from "types/PostInfo";
import { PostCard } from "components/post-card/post-card";
import unicornProfilePicMap from "../../../public/unicorn-profile-pic-map";
import { useSearchParams } from "./use-search-params";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { useDebouncedValue } from "./use-debounced-value";

const SEARCH_QUERY_KEY = "searchQuery";
const SEARCH_PAGE_KEY = "searchPage";

function SearchPageBase() {
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
		});

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					immediatelySetDebouncedSearchVal(searchVal);
				}}
			>
				<input
					value={searchVal}
					onInput={(e) => search((e.target as HTMLInputElement).value)}
				/>
				<button>Search</button>
			</form>
			{(isLoading || isInitialLoading || isFetching) && <h1>Loading...</h1>}
			<div>
				{data.posts.length} / {data.totalPosts}
				{data.posts.map((post) => {
					return (
						<PostCard post={post} unicornProfilePicMap={unicornProfilePicMap} />
					);
				})}
			</div>
			<div>{isError && <div>Error: {error}</div>}</div>
			<Pagination
				softNavigate={(href) => {
					pushState(href);
				}}
				page={{
					currentPage: page,
					lastPage: 10,
				}}
				getPageHref={(pageNum) => {
					urlParams.set(SEARCH_PAGE_KEY, pageNum.toString());
					return `${window.location.pathname}?${urlParams.toString()}`;
				}}
			/>
		</div>
	);
}

const queryClient = new QueryClient();

export default function SearchPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<SearchPageBase />
		</QueryClientProvider>
	);
}
