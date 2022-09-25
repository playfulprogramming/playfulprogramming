import styles from "./user-profile-pic.module.scss";
import { UnicornInfo } from "uu-types";

// TODO: Fix image loading and image 'onClick'
interface UserProfilePicProps {
	authors: Array<UnicornInfo>;
	unicornProfilePicMap: astroHTML.JSX.ImgHTMLAttributes[];
	className: string;
}

export const UserProfilePic = ({
	authors,
	className,
	unicornProfilePicMap,
}: UserProfilePicProps) => {
	const hasTwoAuthors = authors.length !== 1;
	return (
		<div class={`${styles.container} ${className || ""}`}>
			{authors.map((unicorn, i) => {
				const imgAttrs = unicornProfilePicMap.find((u) => u.id === unicorn.id);
				const classesToApply = hasTwoAuthors ? styles.twoAuthor : "";

				return (
					<div
						class={`pointer ${styles.profilePicContainer} ${classesToApply}`}
						style={`border-color: ${unicorn.color};`}
					>
						<img
							data-testid={`author-pic-${i}`}
							alt={unicorn.name}
							class={`circleImg ${styles.profilePicImage} ${styles.width50} ${classesToApply}`}
							{...(imgAttrs as any)}
						/>
					</div>
				);
			})}
		</div>
	);
};
