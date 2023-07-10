import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import { Pagination } from "components/pagination/pagination";
import { useDebounce } from "./use-debounce";
import { PostInfo } from "types/PostInfo";
import { PostCard } from "components/post-card/post-card";
import unicornProfilePicMap from "../../../public/unicorn-profile-pic-map";
import { useSearchParams } from "./use-search-params";

const SEARCH_QUERY_KEY = "searchQuery";
const SEARCH_PAGE_KEY = "searchPage";

export default function SearchPage() {
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

	const abortController = useRef<AbortController | undefined>();

	const [searchResult, setSearchResult] = useState<{
		state: "loading" | "error" | "success";
		posts: PostInfo[];
		totalPosts: number;
	}>({ state: "loading", posts: [], totalPosts: 0 });

	const fn = useDebounce(
		(val: string) => {
			setSearchResult({ state: "loading", posts: [], totalPosts: 0 });
			if (abortController.current) {
				abortController.current.abort();
				abortController.current = undefined;
			}
			abortController.current = new AbortController();
			// plausible("search", { props: { searchVal: val } });
			fetch(`/api/search?query=${val}`, {
				signal: abortController.current.signal,
			})
				.then((res) => res.json())
				.then(async (serverVal: { posts: PostInfo[]; totalPosts: number }) => {
					setSearchResult({
						state: "success",
						posts: serverVal.posts,
						totalPosts: serverVal.totalPosts,
					});
					abortController.current = undefined;
				})
				.catch((err) => {
					if (err.name === "AbortError") {
						return;
					}
					setSearchResult({ state: "error", posts: [], totalPosts: 0 });
					abortController.current = undefined;
				});
		},
		{ delay: 500, immediate: false }
	);

	useEffect(() => {
		fn(searchVal);
	}, [searchVal]);

	return (
		<div>
			<form>
				<input value={searchVal} onInput={(e) => search(e.target.value)} />
			</form>
			{searchResult.state === "loading" && <div>Loading...</div>}
			<div>
				{searchResult.posts.length} / {searchResult.totalPosts}
				{searchResult.posts.map((post) => {
					return (
						<PostCard post={post} unicornProfilePicMap={unicornProfilePicMap} />
					);
				})}
			</div>
			<div>{searchResult.state === "error" && <div>Error</div>}</div>
			<Pagination
				shouldSoftNavigate={true}
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
