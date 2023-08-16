import { useEffect, useReducer } from "preact/hooks";

export const useSearchParams = () => {
	const [urlParams, pushState] = useReducer<
		URLSearchParams,
		{ key: string; val?: string } | string | boolean
	>((prevParams, action) => {
		const pushStateIfNotEqual = (nav: string) => {
			if (
				new URL(nav, window.location.href).searchParams.toString() !==
				new URL(window.location.href).searchParams.toString()
			) {
				window.history.pushState({}, "", nav);
			}
		};

		if (typeof action === "string") {
			const newParams = new URL(action, window.location.href).searchParams;
			const nav = action;
			pushStateIfNotEqual(nav);
			return newParams;
		} else if (typeof action === "boolean") {
			const newParams = new URL(window.location.href).searchParams;
			const nav = window.location.href;
			if (action) pushStateIfNotEqual(nav);
			return newParams;
		}

		/**
		 * This cannot reference window.location.search directly,
		 * as Chrome will throttle the pushState if the user is
		 * spamming the any of the filters.
		 *
		 * This is a workaround to prevent the throttling.
		 */
		const newParams = new URLSearchParams(prevParams.toString());

		if (action.val !== undefined) newParams.set(action.key, action.val);
		else newParams.delete(action.key);

		const nav = `${window.location.pathname}?${newParams.toString()}`;
		pushStateIfNotEqual(nav);
		return newParams;
	}, new URLSearchParams(window.location.search));

	useEffect(() => {
		const listener = () => {
			setTimeout(() => {
				pushState(false);
			}, 10);
		};
		window.addEventListener("popstate", listener);
		return () => {
			window.removeEventListener("popstate", listener);
		};
	});

	return {
		urlParams,
		pushState,
	};
};
