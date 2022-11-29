import { JSX } from "preact";
import { useMemo, useState } from "preact/hooks";

interface RepeatBackgroundProps {
	svg: string;
	fallbackStyle?: Omit<JSX.HTMLAttributes<HTMLElement>["style"], string>;
	aspectRatio: string;
}

export const RepeatBackground = ({
	svg,
	fallbackStyle = {},
	aspectRatio
}: RepeatBackgroundProps) => {
	const [repeat, setRepeat] = useState(1);
	const [hasSet, setHasSet] = useState(false);

	const arraySizeOfRepeat = useMemo(() => {
		return Array.from({ length: repeat }, (_, i) => i);
	}, [repeat]);

	// Client-only
	if (typeof globalThis.window !== "undefined") {
		return (
			<div style={{ display: "flex", flexWrap: "nowrap", height: "100%", '--svgAspectRatio': aspectRatio }}>
				{arraySizeOfRepeat.map((_) => (
					<div
						style={{marginLeft: -1}}
						class="repeat-background-svg-container"
						ref={(el) => {
							if (hasSet || !el) return;
							setHasSet(true);
							const repeatLocal = Math.ceil(
								window.innerWidth / el.getBoundingClientRect().width
							);
							setRepeat(repeatLocal);
						}}
						dangerouslySetInnerHTML={{ __html: svg }}
					></div>
				))}
			</div>
		);
	}

	return (
		<div
			style={{
				backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
				width: "100%",
				backgroundPosition: "center center",
				backgroundRepeat: "repeat no-repeat",
				height: "100%",
				backgroundSize: "auto 100%",
				...fallbackStyle,
			}}
		/>
	);
};
