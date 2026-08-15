import { RepeatBackground } from "../../framework-field-guide/cover-layers/shared/repeat-background.tsx";

const svg = `<svg class="nofill" data-repeated="true" viewBox="0 0 2388 2388" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="1801" width="2388" height="587" fill="#9E3D1C"/></svg>`;

export const SecondLoop = () => {
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
