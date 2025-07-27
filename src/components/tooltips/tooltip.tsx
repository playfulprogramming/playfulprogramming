import { RawSvg } from "components/image/raw-svg";
import InfoIcon from "src/icons/info.svg?raw";
import WarningIcon from "src/icons/warning.svg?raw";
import style from "./tooltip.module.scss";
import { JSXNode } from "components/types";

interface TooltipProps {
	icon: "info" | "warning";
	title: string;
	children?: JSXNode;
}

export function Tooltip({ icon, title, children }: TooltipProps) {
	return (
		<blockquote class={style.tooltip}>
			<div class={style.title}>
				<RawSvg aria-hidden icon={icon === "info" ? InfoIcon : WarningIcon} />
				<p>{title}</p>
			</div>
			{children && <div class={style.content}>{children}</div>}
		</blockquote>
	);
}
