import { useMemo } from "preact/hooks";
import { useCSSPropertyValue } from "../../hooks/use-css-property-value";
import { RepeatBackground } from "../shared/repeat-background";

export const CloudsThirdLayer = () => {
	const cloudThirdColor = useCSSPropertyValue("--inter-700", "#422474");

	const svg = useMemo(() => {
		return `<svg class="nofill" data-repeated="true" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 1432 1280'><path fill='${cloudThirdColor}' d='M0 512v768h1432V512a82 82 0 0 0-114 1 65 65 0 0 0-51 7 103 103 0 0 0-196 43 95 95 0 0 0-114 50 60 60 0 0 0-46-6 75 75 0 0 0-96-8 82 82 0 0 0-132-20 59 59 0 0 0-109 12 75 75 0 0 0-18 2 76 76 0 0 0-132-34 89 89 0 0 0-97-7 127 127 0 0 0-251-16 50 50 0 0 0-76-24Z'/></svg>`;
	}, [cloudThirdColor]);

	return <RepeatBackground aspectRatio={"1432/1280"} svg={svg} />;
};
