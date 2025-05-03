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

/** @jsxImportSource hastscript */
export function SnitipLink(props: LinkProps): Element {
	return (
		<button
			id={"snitip-" + props.id}
			popovertarget={"snitip-popover-" + props.id}
			popovertargetaction="show"
			class="snitip__link"
		>
			{props.children}
		</button>
	) as never;
}
