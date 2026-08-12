/** @jsxRuntime automatic */
import type { Element, ElementContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import fs from "fs/promises";
import type { SnitipInfo } from "#types/SnitipInfo.ts";

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
	const supportId = `${props.scopeId}-${props.id}`;
	const dialogId = `snitip-dialog-${supportId}`;
	return (
		<span
			class="snitip-trigger"
			data-snitip-trigger={props.id}
			data-snitip-dialog={dialogId}
		>
			<button
				type="button"
				class="snitip-trigger__button a"
				aria-controls={dialogId}
				aria-expanded="false"
				aria-haspopup="dialog"
				aria-label={`Open tooltip for "${props.snitip.title}"`}
			>
				<span class="snitip-trigger__text">{props.children}</span>
				<span aria-hidden="true" class="snitip-trigger__popup inline-popup">
					<span class="inline-popup__content">Open tooltip</span>
				</span>
				{InfoIcon}
			</button>
		</span>
	) as never;
}
