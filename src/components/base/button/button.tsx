import style from "./button.module.scss";
import { createElement } from "preact";

type ButtonProps = {
	tag?: "a" | "button";
	class?: string;
	state?: "selected" | "inactive";
	variant?: "primary" | "borderless";
	large?: boolean;
	children: React.ReactNode,
} & React.ButtonHTMLAttributes<any> & React.AnchorHTMLAttributes<any>;

export function Button({ tag, class: className, children, state, variant, large, ...props }: ButtonProps) {
	const Wrapper = (props: any) => createElement(tag || "a", props, props.children);

	return (
		<Wrapper {...props} aria-label={props["aria-label"]} class={[
			!large && "text-style-button",
			large && `text-style-button-large ${style.large}`,
			style.button, className, style[variant], state,
		].filter(c => !!c).join(" ")}>
			{children}
		</Wrapper>
	);
}
