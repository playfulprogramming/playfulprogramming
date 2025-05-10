import { PropsWithChildren } from "../types";
import style from "./chip.module.scss";
import { JSX } from "preact";
import { forwardRef } from "preact/compat";

type ChipProps = PropsWithChildren<{
	tag?: "a" | "button";
	class?: string;
	className?: string;
	icon?: JSX.Element;
}> &
	JSX.ButtonHTMLAttributes &
	JSX.AnchorHTMLAttributes;

export const Chip = forwardRef<HTMLElement, ChipProps>(
	({ children, tag, icon, class: classClass, className, ...props }, ref) => {
		const Wrapper = tag ?? "a";
		return (
			<Wrapper
				{...props}
				ref={ref as never}
				class={`${style.chip} text-style-button-regular ${classClass ?? ""} ${
					className ?? ""
				}`}
			>
				{icon}
				<span class={`${style.chip_content}`}>{children}</span>
			</Wrapper>
		);
	},
);
