/** @jsxRuntime automatic */
import { Node, Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { promises as fs } from "fs";

const info = await fs.readFile("src/icons/info.svg", "utf8");
const warning = await fs.readFile("src/icons/warning.svg", "utf8");

const InfoIcon = fromHtml(info, { fragment: true }).children[0] as Element;
InfoIcon.properties["aria-hidden"] = "true";

const WarningIcon = fromHtml(warning, { fragment: true })
	.children[0] as Element;
WarningIcon.properties["aria-hidden"] = "true";

interface TooltipProps {
	icon: "info" | "warning";
	title: string;
	children: Node[];
}

/** @jsxImportSource hastscript */
export function Tooltip({ icon, title, children }: TooltipProps): Element {
	return (
		<blockquote class="tooltip">
			<div class="tooltip__title">
				{icon === "info" ? InfoIcon : WarningIcon}
				<p>{title}</p>
			</div>
			<div class="tooltip__content">{children}</div>
		</blockquote>
	) as never;
}
