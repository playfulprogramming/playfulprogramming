import { JSXNode, PropsWithChildren } from "../types";
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

function ButtonWrapper({ tag = "a", class: className, children, variant = "primary", leftIcon, rightIcon, ...props }: ButtonProps) {
	const Wrapper = (props: any) => createElement(tag, props, props.children);

	return (
		<Wrapper {...props} aria-label={props["aria-label"]} class={[
			"button", className, variant,
		].filter(c => !!c).join(" ")}>
			{leftIcon &&
				<div class="buttonIcon">
					{leftIcon}
				</div>
			}
			<span className="innerText">{children}</span>
			{rightIcon &&
				<div class="buttonIcon">
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
			class={`text-style-button-regular regular ${className}`}
		/>
	);
}

export function LargeButton({ class: className = "", ...props }: ButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			class={`text-style-button-large large ${className}`}
		/>
	);
}

type IconOnlyButtonProps = Omit<ButtonProps, "leftIcon" | "rightIcon">

export function IconOnlyButton({ class: className = "", children, ...props }: IconOnlyButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			class={`iconOnly regular ${className}`}
		>
			<div class="iconOnlyButtonIcon">{children}</div>
		</ButtonWrapper>
	);
}

export function LargeIconOnlyButton({ class: className = "", children, ...props }: IconOnlyButtonProps) {
	return (
		<ButtonWrapper
			{...props}
			class={`iconOnly large ${className}`}
		>
			<div class="iconOnlyButtonIcon">{children}</div>
		</ButtonWrapper>
	);
}
