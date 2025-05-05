/** @jsxRuntime automatic */
import type { Element, ElementContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { promises as fs } from "fs";

interface LinkProps {
	id: string,
	children: ElementContent[];
}

const info = await fs.readFile("src/icons/info.svg", "utf8");

const InfoIcon = fromHtml(info, { fragment: true }).children[0] as Element;
InfoIcon.properties["aria-hidden"] = "true";
InfoIcon.properties["class"] = "snitip-trigger__icon";

/** @jsxImportSource hastscript */
export function SnitipLink(props: LinkProps): Element {
	return (
		<button
			id={"snitip-" + props.id}
			popovertarget={"snitip-popover-" + props.id}
			popovertargetaction="show"
			class="snitip-trigger a"
			data-snitip-trigger
		>
			<div class="snitip-trigger__tooltip tooltip">
				Open tooltip
			</div>
			<span class="snitip-trigger__text">{props.children}</span>
			{InfoIcon}
		</button>
	) as never;
}
