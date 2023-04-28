import { JSXNode, PropsWithChildren } from "../types";
import style from "./button.module.scss";
import { createElement } from "preact";
import { JSX } from "preact";

type ButtonProps = PropsWithChildren<
	{
		tag?: "a" | "button";
		class?: string;
		leftIcon?: JSXNode;
		rightIcon?: JSXNode;
		variant?: "primary-emphasized" | "secondary-emphasized" | "primary" | "secondary";
	} & JSX.HTMLAttributes<HTMLButtonElement & HTMLAnchorElement>
>;

function ButtonWrapper({ tag = "a", className, children, variant = "primary", leftIcon, rightIcon, ...props }: ButtonProps) {
	const Wrapper = (props: any) => createElement(tag, props, props.children);

	return (
		<Wrapper {...props} aria-label={props["aria-label"]} className={[
			style.button, className, style[variant]
		].filter(c => !!c).join(" ")}>
			{leftIcon &&
				<div className={`${ style.buttonIcon }`}>
					{leftIcon}
				</div>
			}
			{children}
			{rightIcon &&
				<div className={`${ style.buttonIcon }`}>
					{rightIcon}
				</div>
			}
		</Wrapper>
	);
}

export function Button({ class: className = "", ...props }: ButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			className={`text-style-button ${style.regular} ${className}`}
		/>
	);
}

export function LargeButton({ class: className = "", ...props }: ButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			className={`text-style-button-large ${style.large} ${className}`}
		/>
	);
}

type IconOnlyButtonProps = Omit<ButtonProps, "leftIcon" | "rightIcon">

export function IconOnlyButton({ class: className = "", children, ...props }: IconOnlyButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			className={`${style.iconOnly} ${style.regular} ${className}`}
		>
			<div className={style.iconOnlyButtonIcon}>{children}</div>
		</ButtonWrapper>
	);
}

export function LargeIconOnlyButton({ class: className = "", children, ...props }: IconOnlyButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			className={`${style.iconOnly} ${style.large} ${className}`}
		>
			<div className={style.iconOnlyButtonIcon}>{children}</div>
		</ButtonWrapper>
	);
}
