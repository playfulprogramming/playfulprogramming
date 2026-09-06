import { RepeatBackground } from "#src/views/collection-framework-field-guide/components/book-cover/shared/repeat-background.tsx";

const svg = `<svg class="nofill" data-repeated="true" viewBox="0 0 2388 2388" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M753 1904L628 1816L0 1816V2388L2388 2388V1816H1759.5L1653 1946L1577 1965L1505 1995.5H1269.5L1227.5 1965H1163L1102 1995.5H939L916 1946H866.5L829 1904H753Z" fill="#F3AD51"/></svg>`;

export const FourthLoop = () => {
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
