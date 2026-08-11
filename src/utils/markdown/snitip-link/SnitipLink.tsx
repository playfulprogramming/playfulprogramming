/** @jsxRuntime automatic */
import type { Element, ElementContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import fs from "fs/promises";
import type { SnitipInfo } from "#types/SnitipInfo.ts";
import { v4 as uuidv4 } from "uuid";

interface LinkProps {
	id: string;
	scopeId: string;
	snitip: SnitipInfo;
	children: ElementContent[];
}

const info = await fs.readFile("src/icons/info.svg", "utf8");

const InfoIcon = fromHtml(info, { fragment: true }).children[0] as Element;
InfoIcon.properties["aria-hidden"] = "true";
InfoIcon.properties["class"] = "snitip-trigger__icon";

/** @jsxImportSource hastscript */
export function SnitipLink(props: LinkProps): Element {
	const popoverId = `snitip-popover-${uuidv4()}`;
	const supportId = `${props.scopeId}-${props.id}`;
	return (
		<span
			class="snitip-trigger a"
			data-snitip-trigger={props.id}
			data-snitip-template={`snitip-popover-template-${supportId}`}
			data-snitip-dialog={`snitip-dialog-${supportId}`}
		>
			<span class="snitip-trigger__text">{props.children}</span>
			<button
				type="button"
				class="snitip-trigger__button"
				popovertarget={popoverId}
				popovertargetaction="show"
				aria-label={`Open tooltip for "${props.snitip.title}"`}
			>
				<span class="snitip-trigger__popup inline-popup">
					<span class="inline-popup__content">Open tooltip</span>
				</span>
				{InfoIcon}
			</button>
		</span>
	) as never;
}
