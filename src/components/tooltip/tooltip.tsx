import { JSXNode, PropsWithChildren } from "components/types";
import "./tooltip.scss";
import { HTMLAttributes } from "preact/compat";
import classNames from "classnames";

export type TooltipProps = {
	icon?: JSXNode;
} & PropsWithChildren & HTMLAttributes<HTMLDivElement>;

export function Tooltip({ icon, children, ...extra }: TooltipProps) {
	return (
		<div {...extra} class={classNames("tooltip", extra.class)}>
			{icon ? <div class="tooltip__icon" aria-hidden>{icon}</div> : null}
			<span class="tooltip__content">{children}</span>
		</div>
	);
}