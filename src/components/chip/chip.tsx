import { JSXNode, PropsWithChildren } from "../types";
import style from "./chip.module.scss";

type ChipProps = PropsWithChildren<{
	href?: string;
	class?: string;
	icon?: JSXNode;
}>;

export function Chip({ href, icon, children }: ChipProps) {
	return (
		<a class={`${style.chip} text-style-button-regular`} href={href}>
			{icon || ""}
			<span class={`${style.chip_content}`}>{children}</span>
		</a>
	);
}
