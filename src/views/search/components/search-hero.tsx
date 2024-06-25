import { JSXNode } from "components/types";
import styles from "./search-hero.module.scss";
import tags from "../../../../content/data/tags.json";

const stickers = Object.values(tags)
	.filter(
		(tag) =>
			"shownWithBranding" in tag && "image" in tag && tag.shownWithBranding,
	)
	.sort(() => 0.5 - Math.random()) as { image: string }[];

const stickerTransforms = [
	styles.sticker1,
	styles.sticker2,
	styles.sticker3,
	styles.sticker4,
	styles.sticker5,
	styles.sticker6,
	styles.sticker7,
	styles.sticker8,
].map((className) => {
	const sticker = stickers.pop();
	return {
		...sticker,
		className,
	};
});

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
			{stickerTransforms.map((sticker) => (
				<img
					aria-hidden="true"
					src={sticker.image}
					class={sticker.className}
					alt=""
				/>
			))}

			<img className={styles.image} src={imageSrc} alt={imageAlt} />
			<h2 class={`text-style-headline-1 ${styles.title}`}>{title}</h2>
			<p class={`text-style-body-medium ${styles.description}`}>
				{description}
			</p>
			{buttons ? <div class={styles.buttons}>{buttons}</div> : null}
		</div>
	);
};
