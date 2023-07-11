import { useReducer } from "preact/hooks";

export const useSearchParams = () => {
	const [urlParams, pushState] = useReducer<
		URLSearchParams,
		{ key: string; val: string } | string
	>((_, action) => {
		let newParams: URLSearchParams | undefined;
		let nav!: string;
		if (typeof action === "string") {
			nav = action;
		} else {
			newParams = new URLSearchParams(window.location.search);
			newParams.set(action.key, action.val);
			nav = `${window.location.pathname}?${newParams.toString()}`;
		}
		window.history.pushState({}, "", nav);
		return newParams ?? new URLSearchParams(window.location.search);
	}, new URLSearchParams(window.location.search));

	return {
		urlParams,
		pushState,
	};
};
