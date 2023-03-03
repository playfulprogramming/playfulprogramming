import style from "./card.module.scss";
import { createElement } from "preact";

interface CardProps {
	tag?: "li" | "div";
	href?: string;
	class?: string;
	children: JSX.Element|JSX.Element[];
}

export function Card({ tag, children, class: className, ...props }: CardProps) {
	const Wrapper = (props: any) => createElement(tag || "div", {
		role: tag === "li" ? "listitem" : undefined,
		...props,
	}, props.children);

	return (
		<Wrapper class={[
			style.card, className,
			props.href && style.interactive,
		].filter(c => !!c).join(" ")} onclick={props.href && `location.href='${props.href}'`}>
			{children}
		</Wrapper>
	);
}
