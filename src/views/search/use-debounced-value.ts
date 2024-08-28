import { Inputs, useCallback, useEffect, useRef, useState } from "preact/hooks";
import { debounce } from "utils/debounce";

export function useDebouncedValue<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	const immediatelySetDebouncedValue = setDebouncedValue;

	return [debouncedValue, immediatelySetDebouncedValue] as const;
}

export function useDebouncedCallback<T extends Function>(
	callback: T,
	delay: number,
	inputs: Inputs,
): T {
	const cb = useCallback(callback, inputs);

	const handler = useRef<NodeJS.Timeout>();
	const invoke = useCallback(
		(...args: unknown[]) => {
			handler.current && clearTimeout(handler.current);
			handler.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[cb],
	);

	return invoke as never as T;
}
