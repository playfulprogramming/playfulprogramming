import { useMemo } from "preact/hooks";

/**
 * Provides a replacement for preact's `useId()` which can be used
 * as a unique identifier for an element.
 *
 * Preact's implementation will return duplicate IDs in Astro:
 * https://github.com/preactjs/preact/issues/3781
 */
export function useRandomId() {
	return `U${useUUID().replace(/\-/g, "")}`;
}

/**
 * Returns a random UUID that is persisted in a useMemo.
 */
export function useUUID() {
	return useMemo(() => {
		return crypto.randomUUID();
	}, []);
}
