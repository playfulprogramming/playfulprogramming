/**
 * Code migrated from this PR to use ES6 imports:
 * @see https://github.com/rehooks/window-size/pull/4
 */
import { useEffect, useState, useCallback, useRef } from "react";

function getSize() {
	if (!global.window || !window) {
		return {};
	}

	return {
		innerHeight: window.innerHeight,
		innerWidth: window.innerWidth,
		outerHeight: window.outerHeight,
		outerWidth: window.outerWidth
	};
}

export const useWindowSize = debounceMs => {
	const [windowSize, setWindowSize] = useState(getSize());
	const timeoutIdRef = useRef();

	const timeoutId = timeoutIdRef && timeoutIdRef.current;

	const handleResize = useCallback(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutIdRef.current = setTimeout(() => {
			setWindowSize(getSize());
		}, debounceMs || 0);
	}, [timeoutId, debounceMs]);

	useEffect(() => {
		if (windowSize.innerHeight === undefined) {
			setWindowSize(getSize());
		}

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [handleResize, windowSize.innerHeight]);

	return windowSize;
};
