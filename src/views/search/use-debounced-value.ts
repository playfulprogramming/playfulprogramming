import { useEffect, useState } from "preact/hooks";

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
