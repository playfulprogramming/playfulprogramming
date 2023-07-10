import { useReducer } from "preact/hooks";

export const useSearchParams = () => {
	const [urlParams, pushState] = useReducer<
		URLSearchParams,
		{ key: string; val: string } | string
	>((_, action) => {
		const newParams = new URLSearchParams(window.location.search);
		let nav!: string;
		if (typeof action === "string") {
			nav = action;
		} else {
			newParams.set(action.key, action.val);
			nav = `${window.location.pathname}?${newParams.toString()}`;
		}
		window.history.pushState({}, "", nav);
		return newParams;
	}, new URLSearchParams(window.location.search));

	return {
		urlParams,
		pushState,
	};
};
