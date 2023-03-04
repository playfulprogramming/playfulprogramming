import style from "./card.module.scss";
import { createElement } from "preact";

interface CardProps {
	tag?: "li" | "div";
	href?: string;
	class?: string;
	size?: "xl" | "l" | "m" | "s";
	children: JSX.Element|JSX.Element[];
}

export function Card({ tag = "div", size = "xl", children, class: className, ...props }: CardProps) {
	const Wrapper = (props: any) => createElement(tag, {
		role: tag === "li" ? "listitem" : undefined,
		...props,
	}, props.children);

	return (
		<Wrapper class={[
			style.card, className, style[size],
			props.href && style.interactive,
		].filter(c => !!c).join(" ")} onclick={props.href && `location.href='${props.href}'`}>
			{children}
		</Wrapper>
	);
}

export function CardInline({ class: className, ...props }: CardProps) {
	return (
		<Card
			{...props}
			class={`${style.inline} ${className}`}
		/>
	);
}
