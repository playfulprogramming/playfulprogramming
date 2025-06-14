import { JSXNode } from "components/types";
import style from "./anchored-tooltip.module.scss";
import classNames from "classnames";

interface AnchoredTooltipProps {
	type: "primary" | "variant";
	icon: JSXNode;
	label: string;
	class?: string;
}

export function AnchoredTooltip(props: AnchoredTooltipProps) {
	return (
		<span class={classNames(style.anchoredTooltip, props.class)} data-style={props.type}>
			{props.icon}
			<span>{props.label}</span>
		</span>
	);
}
