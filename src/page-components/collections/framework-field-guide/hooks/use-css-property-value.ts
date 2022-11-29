import { useLayoutEffect, useState } from "preact/hooks";

export const useCSSPropertyValue = (property: string, defaultVal: string) => {
	const [cssColorValue, setCssColorValue] = useState(defaultVal);

	useLayoutEffect(() => {
		function getComputedStyle() {
			const computedStyle = window.getComputedStyle(document.documentElement);
			setCssColorValue(computedStyle.getPropertyValue(property));
		}

		getComputedStyle();
		window.addEventListener("scroll", getComputedStyle);
		return () => window.removeEventListener("scroll", getComputedStyle);
	}, [property]);

	return cssColorValue;
};
