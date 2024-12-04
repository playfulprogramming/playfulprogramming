/** @jsxRuntime automatic */
import type { Element, ElementContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { SnitipMetadata } from "types/SnitipInfo";
import { promises as fs } from "fs";

interface LinkProps {
	snitip: SnitipMetadata,
	children: ElementContent[];
}

const info = await fs.readFile("src/icons/info.svg", "utf8");

const InfoIcon = fromHtml(info, { fragment: true }).children[0] as Element;
InfoIcon.properties["aria-hidden"] = "true";

/** @jsxImportSource hastscript */
export function SnitipLink(props: LinkProps): Element {
	return (
		<span data-snitip={JSON.stringify(props.snitip)}>
			<a class="snitip__link" href={props.snitip.href}>
				{props.children}
			</a>
			<span class="snitip__button" tabindex={0} role="button">
				{InfoIcon}
			</span>
		</span>
	) as never;
}
