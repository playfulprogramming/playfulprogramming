import { JSXNode, PropsWithChildren } from "components/types";
import "./inline-popup.scss";
import { HTMLAttributes } from "preact/compat";
import classNames from "classnames";

export type TooltipProps = {
	icon?: JSXNode;
} & PropsWithChildren & HTMLAttributes<HTMLDivElement>;

export function Tooltip({ icon, children, ...extra }: TooltipProps) {
	return (
		<div {...extra} class={classNames("inline-popup", extra.class)}>
			{icon ? <div class="inline-popup__icon" aria-hidden>{icon}</div> : null}
			<span class="inline-popup__content">{children}</span>
		</div>
	);
}