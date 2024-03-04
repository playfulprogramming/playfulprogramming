import { useMemo } from "preact/hooks";
import { useCSSPropertyValue } from "../../hooks/use-css-property-value";
import { RepeatBackground } from "../shared/repeat-background";

export const CloudsFourthLayer = () => {
	const cloudFourthColor = useCSSPropertyValue("--inter-800", "#261456");

	const svg = useMemo(() => {
		return `<svg class="nofill" data-repeated="true" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 1631 1280'><path fill='${cloudFourthColor}' d='M0 1280V391l1 1c6-4 14-6 22-6 28 0 50 23 50 50 12 0 24 5 32 12a101 101 0 0 1 174 6 100 100 0 0 1 109-18 55 55 0 0 1 80-36 126 126 0 0 1 240 48 86 86 0 0 1 126 14 86 86 0 0 1 114 3 86 86 0 0 1 41-8 86 86 0 0 1 102-33c5-8 12-15 19-21a86 86 0 0 1 85-97c46 0 83 36 86 81 11 9 20 21 25 35a86 86 0 0 1 91 30c12-7 26-11 41-12a121 121 0 0 1 193-49v889H0Z'/></svg>`;
	}, [cloudFourthColor]);

	return <RepeatBackground aspectRatio={"1631/1280"} svg={svg} />;
};
