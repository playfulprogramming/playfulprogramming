import { RepeatBackground } from "../../framework-field-guide/cover-layers/shared/repeat-background.tsx";

const svg = `<svg class="nofill" data-repeated="true" viewBox="0 0 2388 2388" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M773.5 2018.28L0 2016V2388H2388V2016H1610H1559.5L1535.5 2022.5L1522.5 2039L1509.5 2048H1477L1412.5 2062.5L1352 2109H1076L1047.5 2087.5V2062.5L997.5 2048L911.5 2062.5L897 2087.5H847L829 2048L794 2034.5L773.5 2018.28Z" fill="#D27C31"/></svg>`;

export const ThirdLoop = () => {
	return (
		<RepeatBackground
			aspectRatio={"2388/2388"}
			svg={svg}
			javascriptEnabledStyle={{
				height: "1px",
				flexGrow: "1",
			}}
		/>
	);
};
