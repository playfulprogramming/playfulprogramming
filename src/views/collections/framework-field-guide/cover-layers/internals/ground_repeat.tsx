import { useMemo } from "preact/hooks";
import { useCSSPropertyValue } from "../../hooks/use-css-property-value";
import { RepeatBackground } from "../shared/repeat-background";

export const GroundRepeat = () => {
	const groundColor = useCSSPropertyValue("--inter-900", "#110A33");

	const svg = useMemo(() => {
		return `<svg class="nofill" data-repeated="true" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 1280 1280'><path fill='${groundColor}' d='M574 1138h-4c-8 1-23 2-30 1l-26 2-25 1-9 1h-19l-5-1-13-1-13-2c-4 1-12 0-16-1a97 97 0 0 0-4 0l-11-1a437 437 0 0 0-42 0l-10 1a130 130 0 0 0-5 0c-4 1-12 2-15 1l-14 2-12 1-5 1a94843 94843 0 0 1-162 4l-10-1a1133 1133 0 0 0-33 1l-17 1a274 274 0 0 0-21 1H0v131h1280v-131h-65l-9-1-17-1-33-1-10 1-5 1-140-5v-1h-5l-12-1-13-1-16-1h-5a287 287 0 0 1-31-2h-21l-11 1a391 391 0 0 0-4 0h-16l-13 1h-13l-5 1a63248 63248 0 0 1-96-1 364 364 0 0 0-39-1l-20-1a1639 1639 0 0 0-82 0l-20 1h-5Z'/></svg>`;
	}, [groundColor]);

	return <RepeatBackground aspectRatio="1280/1280" svg={svg} />;
};
