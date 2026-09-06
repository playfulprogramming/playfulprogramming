import { useLayoutEffect, useState } from "preact/hooks";

export const useCSSPropertyValue = (property: string, defaultVal: string) => {
	const [cssColorValue, setCssColorValue] = useState(defaultVal);

	useLayoutEffect(() => {
		setCssColorValue(`var(${property})`);
	}, [property]);

	return cssColorValue;
};
