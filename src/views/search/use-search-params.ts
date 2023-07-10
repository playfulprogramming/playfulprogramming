import { useReducer } from "preact/hooks";

export const useSearchParams = () => {
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

	return {
		urlParams,
		pushState,
	};
};
