import { useCallback } from "preact/hooks";
import { debounce } from "utils/debounce";
import { useEvent } from "./use-event";

export const useDebounce = <T extends (...args: Array<any>) => any>(
	cb: T,
	{ delay, immediate }: { delay: number; immediate: boolean }
) => {
	const fn = useEvent(cb);

	return useCallback(debounce(fn, delay, immediate), [fn, delay, delay]);
};
