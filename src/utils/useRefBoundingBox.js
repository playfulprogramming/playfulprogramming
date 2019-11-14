import { useCallback, useMemo, useRef, useState } from "react";
import { useAfterInit } from "./useAfterInit";
import { useWindowSize } from "./useWindowSize";

const emptyVal = {
	x: 0,
	y: 0,
	bottom: 0,
	height: 0,
	left: 0,
	right: 0,
	top: 0,
	width: 0
};

/**
 * @param {Array} [changeArr] - The callback array for change handling
 * @param {Function} [changeFunc] - The function used to modify the bounding box sizing
 * @param {number} [debounceMs] - The time to debounce the window size by
 * @returns {Object} 0
 * @returns {React.RefObject} 0.ref - The ref to associate with the item
 * @returns {React.RefObject} 0.val - The return of `getBoundingBox` of the ref
 * @returns {number} 0.val.x - The associated value of the bounding box
 * @returns {number} 0.val.y - The associated value of the bounding box
 * @returns {number} 0.val.bottom - The associated value of the bounding box
 * @returns {number} 0.val.height - The associated value of the bounding box
 * @returns {number} 0.val.left - The associated value of the bounding box
 * @returns {number} 0.val.right - The associated value of the bounding box
 * @returns {number} 0.val.top - The associated value of the bounding box
 * @returns {number} 0.val.width - The associated value of the bounding box
 */
export const useElementBounds = (
	changeArr,
	changeFunc = a => a,
	debounceMs = 150
) => {
	const [val, setVal] = useState(0);
	const afterInit = useAfterInit();
	const windowSize = useWindowSize(debounceMs);

	const diffArr = useMemo(
		() => [...changeArr, windowSize, emptyVal, afterInit],
		[changeArr, windowSize, afterInit]
	);

	const ref = useCallback(
		reff => {
			if (reff) {
				setVal(changeFunc(reff.getBoundingClientRect()));
				return;
			}
			setVal(changeFunc(emptyVal));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		diffArr
	);

	return {
		ref,
		val
	};
};
