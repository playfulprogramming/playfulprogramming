import { RepeatBackground } from "#src/views/collection-framework-field-guide/components/book-cover/shared/repeat-background.tsx";

const svg = `<svg class="nofill" data-repeated="true" viewBox="0 0 2388 2388" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="2006" width="2388" height="382" fill="#42130D"/></svg>`;

export const FirstLoop = () => {
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
