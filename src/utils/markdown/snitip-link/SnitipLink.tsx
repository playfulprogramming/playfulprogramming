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
	const popoverId = "snitip-popover-" + props.id;
	return (
		<span
			id={"snitip-" + props.id}
			class="snitip-trigger a"
			data-snitip-trigger={props.id}
		>
			<span class="snitip-trigger__text">{props.children}</span>
			<button
				class="snitip-trigger__button"
				popovertarget={popoverId}
				popovertargetaction="show"
			>
				<div class="snitip-trigger__popup inline-popup">
					<span class="inline-popup__content">Open tooltip</span>
				</div>
				{InfoIcon}
			</button>
		</span>
	) as never;
}
