import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from "preact/hooks";
import { Pagination } from "components/pagination/pagination";
import { useDebounce } from "./use-debounce";

const SEARCH_QUERY_KEY = "searchQuery";
const SEARCH_PAGE_KEY = "searchPage";

export default function SearchPage() {
	const [urlParams, pushState] = useReducer<
		URLSearchParams,
		{ key: string; val: string }
	>((params, action) => {
		params.set(action.key, action.val);
		window.history.pushState(
			{},
			"",
			`${window.location.pathname}?${params.toString()}`
		);
		return new URLSearchParams(window.location.search);
	}, new URLSearchParams(window.location.search));

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

	const fn = useDebounce(
		(val: string) => {
			console.log("I AM SEARCHING FOR", val);
		},
		{ delay: 500, immediate: false }
	);

	useEffect(() => {
		console.log("RERENDER");
		fn(searchVal);
	}, [searchVal]);

	return (
		<div>
			<form>
				<input value={searchVal} onInput={(e) => search(e.target.value)} />
			</form>
			<Pagination
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
