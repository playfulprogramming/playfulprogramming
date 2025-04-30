import { useMemo } from "preact/hooks";
import { useCSSPropertyValue } from "../../framework-field-guide/hooks/use-css-property-value";
import { RepeatBackground } from "../../framework-field-guide/cover-layers/shared/repeat-background";

export const Floor = () => {
	const floorBackground = useCSSPropertyValue("--floor", "#2D5CAC");

	const svg = useMemo(() => {
		return `<svg class="nofill" data-repeated="true" viewBox="0 0 1680 1680" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="1409" width="1680" height="271" fill="${floorBackground}"/></svg>`
	}, [
		floorBackground
	]);

	return <RepeatBackground aspectRatio={"1680/1680"} svg={svg} />;
};
