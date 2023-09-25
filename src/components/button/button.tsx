import { JSXNode, PropsWithChildren } from "../types";
import { createElement, Ref, VNode } from "preact";
import { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { useMemo } from "preact/hooks";

type AllowedTags = "a" | "button" | "span" | "div";

type ButtonProps<Tag extends AllowedTags> = PropsWithChildren<
	{
		tag?: Tag;
		class?: string;
		leftIcon?: JSXNode;
		rightIcon?: JSXNode;
		// For when the user is _actually_ focused on another element, like react-aria radio buttons
		isFocusVisible?: boolean;
		variant?:
			| "primary-emphasized"
			| "secondary-emphasized"
			| "primary"
			| "secondary";
	} & JSX.HTMLAttributes<
		Tag extends "a"
			? HTMLAnchorElement
			: Tag extends "div"
			? HTMLDivElement
			: Tag extends "span"
			? HTMLSpanElement
			: HTMLButtonElement
	>
>;

const ButtonWrapper = forwardRef(
	<T extends AllowedTags = "a">(
		{
			tag = "a" as never,
			class: className,
			children,
			variant = "primary",
			leftIcon,
			rightIcon,
			isFocusVisible,
			...props
		}: ButtonProps<T>,
		ref: Ref<
			T extends "a"
				? HTMLAnchorElement
				: T extends "div"
				? HTMLDivElement
				: T extends "span"
				? HTMLSpanElement
				: HTMLButtonElement
		>,
	) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const Wrapper: any = tag;

		return (
			<Wrapper
				{...props}
				aria-label={props["aria-label"]}
				class={[
					"button",
					isFocusVisible ? "focusVisible" : "",
					className,
					variant,
				]
					.filter((c) => !!c)
					.join(" ")}
				ref={ref}
			>
				{leftIcon && (
					<div aria-hidden="true" class="buttonIcon">
						{leftIcon}
					</div>
				)}
				<span className="innerText">{children}</span>
				{rightIcon && (
					<div aria-hidden="true" class="buttonIcon">
						{rightIcon}
					</div>
				)}
			</Wrapper>
		);
	},
);

export const Button = forwardRef(
	<T extends AllowedTags = "a">(
		{ class: className = "", ...props }: ButtonProps<T>,
		ref: Ref<T extends "a" ? HTMLAnchorElement : HTMLButtonElement>,
	) => {
		return (
			<ButtonWrapper
				{...props}
				class={`text-style-button-regular regular ${className}`}
				ref={ref}
			/>
		);
	},
);

export const LargeButton = forwardRef(
	<T extends AllowedTags = "a">(
		{ class: className = "", ...props }: ButtonProps<T>,
		ref: Ref<T extends "a" ? HTMLAnchorElement : HTMLButtonElement>,
	) => {
		return (
			<ButtonWrapper
				{...props}
				class={`text-style-button-large large ${className}`}
				ref={ref}
			/>
		);
	},
);

type IconOnlyButtonProps<T extends AllowedTags = "a"> = Omit<
	ButtonProps<T>,
	"leftIcon" | "rightIcon"
>;

export const IconOnlyButton = forwardRef(
	<T extends AllowedTags = "a">(
		{ class: className = "", children, ...props }: IconOnlyButtonProps<T>,
		ref: Ref<T extends "a" ? HTMLAnchorElement : HTMLButtonElement>,
	) => {
		return (
			<ButtonWrapper
				{...props}
				class={`iconOnly regular ${className}`}
				ref={ref}
			>
				<div class="iconOnlyButtonIcon" aria-hidden="true">
					{children}
				</div>
			</ButtonWrapper>
		);
	},
);

export const LargeIconOnlyButton = forwardRef(
	<T extends AllowedTags = "a">(
		{ class: className = "", children, ...props }: IconOnlyButtonProps<T>,
		ref: Ref<T extends "a" ? HTMLAnchorElement : HTMLButtonElement>,
	) => {
		return (
			<ButtonWrapper {...props} class={`iconOnly large ${className}`} ref={ref}>
				<div class="iconOnlyButtonIcon" aria-hidden="true">
					{children}
				</div>
			</ButtonWrapper>
		);
	},
);
