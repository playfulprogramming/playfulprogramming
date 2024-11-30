/** @jsxRuntime automatic */
import { Node, Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { promises as fs } from "fs";

const fullscreen = await fs.readFile("src/icons/fullscreen.svg", "utf8");
const FullscreenIcon = fromHtml(fullscreen, { fragment: true })
	.children[0] as Element;
FullscreenIcon.properties["aria-hidden"] = "true";

const launch = await fs.readFile("src/icons/launch.svg", "utf8");
const LaunchIcon = fromHtml(launch, { fragment: true }).children[0] as Element;
LaunchIcon.properties["aria-hidden"] = "true";

interface ImageTooltipProps {
	type: "zoom" | "link";
	label: string;
	children: Node[];
	anchorAttrs: Record<string, unknown>;
}

/** @jsxImportSource hastscript */
export function ImageTooltip(props: ImageTooltipProps): Element {
	return (
		<a class={`image-tooltip image-tooltip--${props.type}`} {...props.anchorAttrs}>
			<div class="image-tooltip__label text-style-button-regular">
				{props.type === "zoom" ? FullscreenIcon : LaunchIcon}
				<span>{props.label}</span>
			</div>
			{props.children}
		</a>
	) as never;
}
