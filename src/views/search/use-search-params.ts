import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { debounce } from "utils/debounce";

export type SetSearchParams<T> = (updater: (prev: T) => T) => void;

export function useSearchParams<T>(
	serialize: (params: T) => URLSearchParams,
	deserialize: (params: URLSearchParams) => T,
	getPageTitle?: (params: T) => string,
): [T, SetSearchParams<T>] {
	const [urlParams, setUrlParams] = useState<URLSearchParams>(
		() => new URL(window.location.href).searchParams,
	);

	useEffect(() => {
		if (getPageTitle) {
			// Set the title from the initial params when the page is first loaded
			document.title = getPageTitle(deserialize(urlParams));
		}
	}, []);

	const pushHistoryState = useMemo(() => {
		// Debounce any calls to pushState to avoid spamming the history API
		return debounce(
			(urlParams: URLSearchParams) => {
				const currentUrl = new URL(window.location.href).toString();
				const newUrl = new URL(
					"?" + urlParams.toString(),
					window.location.href,
				).toString();

				if (currentUrl != newUrl) {
					window.history.pushState({}, "", newUrl);
					if (getPageTitle) {
						// When a new history state is pushed, update tht title so that the new history entry is accurate
						document.title = getPageTitle(deserialize(urlParams));
					}
				}
			},
			500,
			false,
		);
	}, []);

	useEffect(() => {
		pushHistoryState(urlParams);
	}, [urlParams]);

	useEffect(() => {
		const onPopState = () => {
			// When 'popstate' is sent, the window properties do not immediately reflect the change
			// so we need to wait until the end of the event loop
			setTimeout(() => {
				const searchParams = new URL(window.location.href).searchParams;
				setUrlParams(searchParams);
			}, 0);
		};

		window.addEventListener("popstate", onPopState);
		return () => {
			window.removeEventListener("popstate", onPopState);
		};
	}, [setUrlParams]);

	const params = useMemo(() => deserialize(urlParams), [urlParams]);

	const setParams = useCallback<SetSearchParams<T>>(
		(updater) => {
			setUrlParams((prevParams) => {
				const previous = deserialize(new URLSearchParams(prevParams));
				const next = updater(previous);

				return serialize(next);
			});
		},
		[deserialize, serialize],
	);

	return [params, setParams];
}
