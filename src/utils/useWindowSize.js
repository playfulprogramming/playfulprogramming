/**
 * Code migrated from this PR to use ES6 imports:
 * @see https://github.com/rehooks/window-size/pull/4
 */
import { useEffect, useState, useCallback } from "react";

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
	let [windowSize, setWindowSize] = useState(getSize());

	let timeoutId;

	const handleResize = useCallback(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(function() {
			setWindowSize(getSize());
		}, debounceMs);
	}, [timeoutId]);

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
