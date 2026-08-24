import FullscreenIcon from "#src/icons/fullscreen.svg?raw";
import LaunchIcon from "#src/icons/launch.svg?raw";
import { AnchoredTooltip } from "./anchored-tooltip.tsx";
import style from "./link-preview.module.scss";
import { RawSvg } from "#components/image/raw-svg.tsx";
import type { JSXNode } from "#components/types.ts";

interface LinkPreviewProps {
	type: "zoom" | "link";
	label: string;
	href: string;
	alt: string;
	children?: JSXNode;
}

export function LinkPreview(props: LinkPreviewProps) {
	return (
		<a
			class={style.linkPreview}
			href={props.href}
			target="_blank"
			rel="nofollow noopener noreferrer"
		>
			<AnchoredTooltip
				type={props.type == "zoom" ? "primary" : "variant"}
				label={props.label}
				icon={
					<RawSvg
						icon={props.type == "zoom" ? FullscreenIcon : LaunchIcon}
						aria-hidden
					/>
				}
				class={style.anchoredTooltip}
			/>
			{props.children}
		</a>
	);
}
