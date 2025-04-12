import { useMemo } from "preact/hooks";
import { useCSSPropertyValue } from "../../hooks/use-css-property-value";
import { RepeatBackground } from "../shared/repeat-background";

export const CloudsFirstLayer = () => {
	const cloudFirstColor = useCSSPropertyValue("--inter-400", "%23A473BB");

	const svg = useMemo(() => {
		return `<svg class="nofill" data-repeated="true" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 1634 1280'><path fill='${cloudFirstColor}' d='M0 962v-91a111 111 0 0 1 194-17 70 70 0 0 1 114 28 58 58 0 0 1 43 5 81 81 0 0 1 115-11 81 81 0 0 1 135 12 81 81 0 0 1 93-14 137 137 0 0 1 248-53 81 81 0 0 1 87 25h1c17 0 32 5 45 14a126 126 0 0 1 232 2 125 125 0 0 1 75-15 83 83 0 0 1 138 16 116 116 0 0 1 114 8v409H0V962Z'/></svg>`;
	}, [cloudFirstColor]);

	return <RepeatBackground aspectRatio={"1634/1280"} svg={svg} />;
};
