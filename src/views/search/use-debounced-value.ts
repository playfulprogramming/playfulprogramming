import { Inputs, useCallback, useEffect, useRef, useState } from "preact/hooks";

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

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function useDebouncedCallback<T extends Function>(
	callback: T,
	delay: number,
	inputs: Inputs,
) {
	const cb = useCallback(
		(...args: unknown[]) => callback(...args),
		// can't statically check deps because inputs is dynamic
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[callback, ...inputs],
	);

	const handler = useRef<ReturnType<typeof setTimeout>>();

	const cancel = useCallback(() => {
		if (handler.current) clearTimeout(handler.current);
	}, [handler]);

	const invoke = useCallback(
		(...args: unknown[]) => {
			cancel();
			handler.current = setTimeout(() => {
				cb(...args);
			}, delay);
		},
		[cb, cancel, delay],
	);

	return {
		callback: invoke as never as T,
		cancel,
	};
}
