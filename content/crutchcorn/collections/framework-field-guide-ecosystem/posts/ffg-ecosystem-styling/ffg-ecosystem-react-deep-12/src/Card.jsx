import style from "./Card.module.css";

export function Card({ title, description }) {
	return (
		<div className={style.card}>
			<h2 data-title>{title}</h2>
			<p>{description}</p>
		</div>
	);
}
