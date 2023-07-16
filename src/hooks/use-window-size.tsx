import { useLayoutEffect, useState } from "preact/hooks";

export const useWindowSize = () => {
	const isBrowser = typeof window !== "undefined";

	const [size, setSize] = useState(() => {
		return {
			width: isBrowser ? window.innerWidth : 0,
			height: isBrowser ? window.innerHeight : 0,
		};
	});

	useLayoutEffect(() => {
		if (!isBrowser) return;
		function getWindowSize() {
			setSize({ height: window.innerHeight, width: window.innerWidth });
		}

		window.addEventListener("resize", getWindowSize);
		getWindowSize();
		return () => window.removeEventListener("resize", getWindowSize);
	}, [isBrowser]);

	return size;
};
