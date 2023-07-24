import { useMemo } from "preact/hooks";
import { useCSSPropertyValue } from "../../hooks/use-css-property-value";
import { RepeatBackground } from "../shared/repeat-background";

export const CloudsSecondLayer = () => {
	const cloudSecondColor = useCSSPropertyValue("--inter-500", "#38154A3");

	const svg = useMemo(() => {
		return `<svg class="nofill" data-repeated="true" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 1631 1280'><path fill='${cloudSecondColor}' d='M1631 1280V679l-1 1c-6-4-14-6-22-6-28 0-50 23-50 50-12 0-24 5-32 12a101 101 0 0 0-174 6 100 100 0 0 0-109-18 55 55 0 0 0-80-36 126 126 0 0 0-240 48 86 86 0 0 0-126 14 86 86 0 0 0-114 3 86 86 0 0 0-41-8 86 86 0 0 0-102-33c-5-8-12-15-19-21l1-11a86 86 0 0 0-172-5c-11 9-20 21-25 35a86 86 0 0 0-91 30c-12-7-26-11-41-12A121 121 0 0 0 0 679v601h1631Z'/></svg>`;
	}, [cloudSecondColor]);

	return <RepeatBackground aspectRatio={"1631/1280"} svg={svg} />;
};
