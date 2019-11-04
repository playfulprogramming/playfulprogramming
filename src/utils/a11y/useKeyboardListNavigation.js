/**
 * This hook is intended to handle keyboard navigation of a list. It is not
 * meant for handling selecting any of those items. There are ways to compose
 * a hook to do so, but that is not this file. To see an example of how to do that,
 * you can see our own composed hook meant for similar:
 *
 * @see ./useSelectableArray.js
 * @see ./useSelectRef.js
 *
 * ✅ Maintain a currently used index
 * ✅ Handle arrow-up to change index
 * ✅ Handle arrow-down to change index
 * ✅ Handle home to change index to first
 * ✅ Handle end to change index to last
 * 🔲 Handle arrow-left to change index via optional prop (?)
 * 🔲 Handle arrow-right to change index via optional prop (?)
 */

import { useEffect, useState } from "react";
import { normalizeNumber } from "../normalize-number";

/**
 * @callback RunOnSubmitCB
 * @param {KeyboardEvent} event
 * @param {number} focusedIndex - The current index
 * @param {number} newIndex - The new index
 * @returns void
 */

/**
 * @param {React.RefObject} parentRef - The parent ref to bind the event handling to
 * @param {*[]} arrVal - The array value to handle navigating the index of
 * @param {boolean} enable - Disable event handling
 * @param {RunOnSubmitCB} [runOnSubmit] - An optional function to hook into the event handler logic
 */
export const useKeyboardListNavigation = (
	parentRef,
	arrVal,
	enable,
	runOnSubmit
) => {
	const [focusedIndex, setFocusedIndex] = useState(0);

	const maxIndex = arrVal.length - 1;

	// Arrow key handler
	useEffect(() => {
		const onKeyDown = event => {
			if (!enable) {
				return;
			}
			/**
			 * This is to enable proper usage of passing a `onKeydown` from props
			 * @see https://reactjs.org/docs/events.html#event-pooling
			 */
			event && event.persist && event.persist();
			let _newIndex;
			switch (event.key) {
				case "ArrowDown":
					event.preventDefault();
					_newIndex = normalizeNumber(focusedIndex + 1, 0, maxIndex);
					break;
				case "ArrowUp":
					event.preventDefault();
					_newIndex = normalizeNumber(focusedIndex - 1, 0, maxIndex);
					break;
				case "Home":
					event.preventDefault();
					_newIndex = 0;
					break;
				case "End":
					event.preventDefault();
					_newIndex = maxIndex;
					break;
				default:
					break;
			}

			if (runOnSubmit) {
				runOnSubmit(event, focusedIndex, _newIndex);
			}

			// None of the keys were selected
			if (_newIndex === undefined) {
				return;
			}

			setFocusedIndex(_newIndex);
		};

		const el = parentRef && parentRef.current;

		if (!el) return;
		el.addEventListener("keydown", onKeyDown);
		return () => el.removeEventListener("keydown", onKeyDown);
	}, [focusedIndex, parentRef, enable, maxIndex, runOnSubmit]);

	const selectIndex = (i, e) => {
		setFocusedIndex(normalizeNumber(i, 0, maxIndex));

		if (runOnSubmit) {
			if (e && e.persist) e.persist();
			runOnSubmit(e, focusedIndex, i);
		}
	};

	return {
		focusedIndex,
		selectIndex
	};
};
