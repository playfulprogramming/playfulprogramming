import { JSXNode } from "components/types";
import styles from "./search-hero.module.scss";

interface SearchHeroProps {
	title: string;
	description: string;
	buttons?: JSXNode;
	imageSrc: string;
	imageAlt: string;
}

export const SearchHero = ({
	title,
	description,
	buttons,
	imageSrc,
	imageAlt,
}: SearchHeroProps) => {
	return (
		<div class={styles.container}>
			<img className={styles.image} src={imageSrc} alt={imageAlt} />
			<h2 class={`text-style-headline-1 ${styles.title}`}>{title}</h2>
			<p class={`text-style-body-medium ${styles.description}`}>
				{description}
			</p>
			{buttons ? <div class={styles.buttons}>{buttons}</div> : null}
		</div>
	);
};
