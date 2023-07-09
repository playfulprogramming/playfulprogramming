import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { Pagination } from "components/pagination/pagination";

const SEARCH_QUERY_KEY = "searchQuery";
const SEARCH_PAGE_KEY = "searchPage";

export default function SearchPage() {
	const [urlParams, setURLParams] = useState(
		new URLSearchParams(window.location.search)
	);

	const search = useCallback(
		(str: string) => {
			urlParams.set(SEARCH_QUERY_KEY, str);
			window.history.pushState(
				{},
				"",
				`${window.location.pathname}?${urlParams.toString()}`
			);
		},
		[urlParams]
	);

	useEffect(() => {
		let previousSearch = window.location.search;
		const observer = new MutationObserver(() => {
			if (window.location.search !== previousSearch) {
				previousSearch = window.location.search;
				setURLParams(new URLSearchParams(window.location.search));
			}
		});
		const config = { subtree: true, childList: true };

		observer.observe(document, config);
		return () => observer.disconnect();
	}, []);

	const searchVal = useMemo(() => urlParams.get(SEARCH_QUERY_KEY), [urlParams]);
	const page = useMemo(
		() => Number(urlParams.get(SEARCH_PAGE_KEY) || "1"),
		[urlParams]
	);

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
