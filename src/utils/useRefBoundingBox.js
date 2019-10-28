import { useMemo, useRef } from "react";
import { useAfterInit } from "./useAfterInit";
import { useWindowSize } from "./useWindowSize";

const getFromBoundClient = rect => ({
	x: rect.x,
	y: rect.y,
	bottom: rect.bottom,
	height: rect.height,
	left: rect.left,
	right: rect.right,
	top: rect.top,
	width: rect.width
});

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

export const useElementBoundingBox = (
	changeItem,
	changeFunc = a => a,
	debounceMs = 150
) => {
	// Get the initial element size
	const afterInit = useAfterInit();
	const windowSize = useWindowSize(debounceMs);
	const ref = useRef();

	const boundingObj = useMemo(() => {
		if (!ref.current)
			return {
				...changeFunc(emptyVal),
				ref
			};
		const bounding = ref.current.getBoundingClientRect();
		return {
			ref,
			...changeFunc(getFromBoundClient(bounding))
		};
	}, [ref, changeFunc]);

	return boundingObj;
};
