import style from "./card.module.scss";

interface CardProps {
	children: React.ReactNode;
}

export function Card({ children }: CardProps) {
	return (
		<div class={style.card}>
			{children}
		</div>
	);
}
