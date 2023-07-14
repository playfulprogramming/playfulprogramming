import { useReducer } from "preact/hooks";

export const useSearchParams = () => {
	const [urlParams, pushState] = useReducer<
		URLSearchParams,
		{ key: string; val?: string } | string
	>((prevParams, action) => {
		let newParams: URLSearchParams | undefined;
		let nav!: string;
		if (typeof action === "string") {
			nav = action;
		} else {
			/**
			 * This cannot reference wnidow.location.search directly,
			 * as Chrome will throttle the pushState if the user is
			 * spamming the any of the filters.
			 *
			 * This is a workaround to prevent the throttling.
			 */
			newParams = new URLSearchParams(prevParams.toString());

			if (action.val !== undefined) newParams.set(action.key, action.val);
			else newParams.delete(action.key);

			nav = `${window.location.pathname}?${newParams.toString()}`;
		}
		window.history.pushState({}, "", nav);
		return newParams ?? new URLSearchParams(prevParams.toString());
	}, new URLSearchParams(window.location.search));

	return {
		urlParams,
		pushState,
	};
};
