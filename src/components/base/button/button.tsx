import { PropsWithChildren } from "../types";
import style from "./button.module.scss";
import { createElement } from "preact";
import { JSX } from "preact";

type ButtonProps = PropsWithChildren<
	{
		tag?: "a" | "button";
		class?: string;
		state?: "selected" | "inactive";
		variant?: "primary" | "borderless";
	} & JSX.HTMLAttributes<HTMLButtonElement & HTMLAnchorElement>
>;

function ButtonWrapper({ tag = "a", class: className, children, state, variant, ...props }: ButtonProps) {
	const Wrapper = (props: any) => createElement(tag, props, props.children);

	return (
		<Wrapper {...props} aria-label={props["aria-label"]} class={[
			style.button, className, style[variant], state,
		].filter(c => !!c).join(" ")}>
			{children}
		</Wrapper>
	);
}

export function Button({ class: className, ...props }: ButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			class={`text-style-button ${className}`}
		/>
	);
}

export function LargeButton({ class: className, ...props }: ButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			class={`text-style-button-large ${style.large} ${className}`}
		/>
	);
}

export function IconButton({ class: className, ...props }: ButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			class={`${style.icon} ${className}`}
		/>
	);
}
