import { useCallback, useEffect } from "react";

/**
 * @param eventName - The name of the event to be bound to
 * @param {*[]} params - Params from parent hook to call
 * @param {React.RefObject} params.$0 - An existing ref to use as the parent ref
 * @param {boolean} params.$1 - Boolean to enable
 * @param {Function} params.$2 - A function to run if the user clicks outside the parent ref
 */
export const useOutsideEvent = (eventName, params) => {
	const [parentRef, enable, onOutsideEvent] = params;

	const currParentRef = parentRef && parentRef.current;

	const handleClickOutside = useCallback(
		e => {
			if (currParentRef.contains(e.target)) {
				// inside click
				return;
			}
			// outside click
			onOutsideEvent();
		},
		[currParentRef, onOutsideEvent]
	);

	useEffect(() => {
		if (enable) {
			document.addEventListener(eventName, handleClickOutside);

			return () => {
				document.removeEventListener(eventName, handleClickOutside);
			};
		}
	}, [enable, handleClickOutside, onOutsideEvent, eventName]);
};
