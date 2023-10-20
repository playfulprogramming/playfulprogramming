import { useMemo } from "preact/hooks";
import { useCSSPropertyValue } from "../../hooks/use-css-property-value";
import { RepeatBackground } from "../shared/repeat-background";

export const BackgroundRepeat = () => {
	const groundColor = useCSSPropertyValue("--fund-900", "#17383F");

	const svg = useMemo(() => {
		return `<svg class="nofill" data-repeated="true" xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 6400 1680'><path fill='${groundColor}' d='m2871 980-21 2c-40 4-117 11-152 9-32-1-79 6-128 13-43 6-87 12-124 14-24 1-46 6-46 6l-64 2-33-2s-11-5-23-6c-19-2-42-8-64-14-25-7-50-14-66-13-18 2-58-5-78-9l-11-2-12-1c-17-2-45-5-53-8-11-4-95-14-105-14-9 0-93 10-104 14-9 3-37 6-53 8l-12 1-11 2c-20 4-60 11-78 9-17-1-41 6-66 13-22 6-45 12-64 14-12 1-24 6-24 6l-786 50-25-4-46-8a3657 3657 0 0 0-168 8c-7 3-48 7-82 11a669 669 0 0 0-55 6l-51-1h-23v1l-198-1H0v594h6400v-594c-96 0-303 9-325 0l-47-5c-34-4-75-8-82-11-12-4-161-8-168-8l-46 8-27 5-700-52v-1s-11-3-23-4c-19-1-42-6-64-11-25-5-49-11-65-10-18 0-58-6-79-9l-10-1-12-1-53-7c-11-3-95-12-104-13a1690 1690 0 0 0-158 9h-12l-11 1c-21 2-61 5-79 3-16-1-40 2-66 6-22 3-45 7-64 7-12 0-23 3-23 3l-394 3c-33-5-63-8-86-7a1532 1532 0 0 1-196-12c-33-2-86-5-103-8-21-4-185-14-203-14s-182 10-203 14c-17 3-70 6-103 8l-23 1Z'/></svg>`;
	}, [groundColor]);

	return (
		<RepeatBackground
			aspectRatio={"6400/1680"}
			svg={svg}
			javascriptEnabledStyle={{
				height: "1px",
				flexGrow: "1",
			}}
		/>
	);
};
