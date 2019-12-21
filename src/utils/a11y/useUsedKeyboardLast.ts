import { RefObject, useCallback, useEffect, useState } from "react";

/**
 * A hook to handle when the keyboard was used last
 *
 * It's impossible (and non-performant) to handle all events,
 * so we're having the consumer themselves handle when to set the value to
 * false by returning the function `resetLastUsedKeyboard`
 */
export const useUsedKeyboardLast = (ref: RefObject<any>, enable: boolean) => {
	const [usedKeyboardLast, setUsedKeyboardLast] = useState(false);

	const resetLastUsedKeyboard = useCallback(
		() => setUsedKeyboardLast(false),
		[]
	);

	useEffect(() => {
		const currRef = ref && ref.current;
		const setUsedKeyboardLastToTrue = () => setUsedKeyboardLast(true);

		if (enable && currRef) {
			currRef.addEventListener("keydown", setUsedKeyboardLastToTrue);

			return () => {
				currRef.removeEventListener("keydown", setUsedKeyboardLastToTrue);
			};
		}
	}, [enable, ref]);

	return {
		usedKeyboardLast,
		resetLastUsedKeyboard
	};
};
