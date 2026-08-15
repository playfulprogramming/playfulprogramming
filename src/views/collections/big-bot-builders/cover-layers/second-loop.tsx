import { RepeatBackground } from "../../framework-field-guide/cover-layers/shared/repeat-background.tsx";

const svg = `<svg class="nofill" data-repeated="true" viewBox="0 0 2388 2388" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 1801L180 1801L232 1786L286 1791L330 1776L392 1790L448 1782L500 1796L560 1801L760 1801L812 1789L870 1780L928 1792L974 1786L1010 1801L1240 1801L1296 1784L1352 1794L1420 1774L1494 1789L1548 1781L1610 1794L1700 1801L1900 1801L1958 1788L2020 1779L2078 1792L2120 1785L2160 1801L2388 1801V2388H0Z" fill="#9E3D1C"/></svg>`;

interface SecondLoopProps {
	side: "left" | "right";
}

// Anchor tiles to the edge that touches the cover art, so the rocky silhouette
// always meets the center layer on a whole tile boundary
export const SecondLoop = ({ side }: SecondLoopProps) => {
	return (
		<RepeatBackground
			aspectRatio={"2388/2388"}
			svg={svg}
			fallbackStyle={{
				backgroundPosition: side === "left" ? "right center" : "left center",
			}}
			javascriptEnabledStyle={{
				height: "1px",
				flexGrow: "1",
				justifyContent: side === "left" ? "flex-end" : "flex-start",
			}}
		/>
	);
};
