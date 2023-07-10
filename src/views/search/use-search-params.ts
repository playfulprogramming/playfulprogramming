import { useReducer } from "preact/hooks";

export const useSearchParams = () => {
	const [urlParams, pushState] = useReducer<
		URLSearchParams,
		{ key: string; val: string } | string
	>((params, action) => {
		let nav!: string;
		if (typeof action === "string") {
			nav = action;
		} else {
			params.set(action.key, action.val);
			nav = `${window.location.pathname}?${params.toString()}`;
		}
		window.history.pushState({}, "", nav);
		return new URLSearchParams(window.location.search);
	}, new URLSearchParams(window.location.search));

	return {
		urlParams,
		pushState,
	};
};
