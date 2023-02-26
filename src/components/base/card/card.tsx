import style from "./card.module.scss";

interface CardProps {
	tag?: "li" | "div";
	href?: string;
	children: JSX.Element|JSX.Element[];
}

export function Card({ children, ...props }: CardProps) {
	const Wrapper = (attrs: any) => props.tag === "li" ? <li role="listitem" {...attrs}/> : <div {...attrs}/>

	return (
		<Wrapper class={style.card} onclick={props.href && `location.href='${props.href}'`}>
			{children}
		</Wrapper>
	);
}
