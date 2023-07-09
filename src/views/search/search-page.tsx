import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

export default function SearchPage() {
	const [urlParams, setURLParams] = useState(
		new URLSearchParams(window.location.search)
	);

	const search = useCallback(
		(str: string) => {
			urlParams.set("q", str);
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

	const searchVal = useMemo(() => urlParams.get("q"), [urlParams]);

	return (
		<div>
			<form>
				<input value={searchVal} onInput={(e) => search(e.target.value)} />
			</form>
		</div>
	);
}
