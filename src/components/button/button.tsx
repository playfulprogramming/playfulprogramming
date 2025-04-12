import { JSXNode, PropsWithChildren } from "../types";
import { JSX } from "preact";
import { ForwardedRef, forwardRef, ReactElement, Ref } from "preact/compat";

export type AllowedTags = "a" | "button" | "span" | "div";

type AllowedJSXElements<Tag extends AllowedTags> = Tag extends "a"
	? JSX.AnchorHTMLAttributes
	: Tag extends "div"
		? JSX.HTMLAttributes<HTMLDivElement>
		: Tag extends "span"
			? JSX.HTMLAttributes<HTMLSpanElement>
			: JSX.ButtonHTMLAttributes;

type AllowedElements<Tag extends AllowedTags> = Tag extends "a"
	? HTMLAnchorElement
	: Tag extends "div"
		? HTMLDivElement
		: Tag extends "span"
			? HTMLSpanElement
			: HTMLButtonElement;

export type ButtonProps<Tag extends AllowedTags> = PropsWithChildren<
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
	} & AllowedJSXElements<Tag>
>;

const ButtonWrapper = forwardRef<
	AllowedElements<AllowedTags> | null,
	ButtonProps<AllowedTags>
>(
	(
		{
			tag = "a" as never,
			class: className,
			children,
			variant = "primary",
			leftIcon,
			rightIcon,
			isFocusVisible,
			...props
		},
		ref,
	) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const Wrapper: any = tag;

		return (
			<Wrapper
				{...props}
				aria-label={props["aria-label"]}
				data-focus-visible={isFocusVisible}
				class={["button", className, variant].filter((c) => !!c).join(" ")}
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
) as <Tag extends AllowedTags = "a">(
	props: ButtonProps<Tag> & { ref?: Ref<Tag> },
) => ReactElement;

export const Button = forwardRef<
	AllowedElements<AllowedTags> | null,
	ButtonProps<AllowedTags>
>(({ class: className = "", ...props }, ref) => {
	return (
		<ButtonWrapper
			{...props}
			class={`text-style-button-regular regular ${className}`}
			ref={ref as never}
		/>
	);
}) as <Tag extends AllowedTags = "a">(
	props: ButtonProps<Tag> & { ref?: Ref<Tag> },
) => ReactElement;

export const LargeButton = forwardRef<
	AllowedElements<AllowedTags> | null,
	ButtonProps<AllowedTags>
>(({ class: className = "", ...props }, ref) => {
	return (
		<ButtonWrapper
			{...props}
			class={`text-style-button-large large ${className}`}
			ref={ref as never}
		/>
	);
}) as <Tag extends AllowedTags = "a">(
	props: ButtonProps<Tag> & { ref?: Ref<Tag> },
) => ReactElement;

type IconOnlyButtonProps<T extends AllowedTags = "a"> = Omit<
	ButtonProps<T>,
	"leftIcon" | "rightIcon"
>;

export const IconOnlyButton = forwardRef<
	AllowedElements<AllowedTags> | null,
	IconOnlyButtonProps<AllowedTags>
>(({ class: className = "", children, ...props }, ref) => {
	return (
		<ButtonWrapper
			{...props}
			class={`iconOnly regular ${className}`}
			ref={ref as never}
		>
			<div class="iconOnlyButtonIcon" aria-hidden="true">
				{children}
			</div>
		</ButtonWrapper>
	);
}) as <Tag extends AllowedTags = "a">(
	props: ButtonProps<Tag> & { ref?: Ref<Tag> },
) => ReactElement;

export const LargeIconOnlyButton = forwardRef<
	AllowedElements<AllowedTags> | null,
	IconOnlyButtonProps<AllowedTags>
>(({ class: className = "", children, ...props }, ref) => {
	return (
		<ButtonWrapper
			{...props}
			class={`iconOnly large ${className}`}
			ref={ref as never}
		>
			<div class="iconOnlyButtonIcon" aria-hidden="true">
				{children}
			</div>
		</ButtonWrapper>
	);
}) as <Tag extends AllowedTags = "a">(
	props: ButtonProps<Tag> & { ref?: Ref<Tag> },
) => ReactElement;
