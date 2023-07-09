import { useCallback, useLayoutEffect, useRef } from "preact/hooks";

export function useEvent<T extends (...args: any[]) => any>(handler: T): T {
	const handlerRef = useRef(null);

	useLayoutEffect(() => {
		handlerRef.current = handler;
	});

	return useCallback(
		((...args) => {
			const fn = handlerRef.current;
			return fn(...args);
		}) as T,
		[]
	);
}
