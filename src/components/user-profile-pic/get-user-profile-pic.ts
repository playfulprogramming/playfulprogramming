import styles from "./user-profile-pic.module.scss";
import { UnicornInfo } from "uu-types";

const jsxPropsToHTMLAttributes = (obj) =>
	Object.keys(obj)
		.filter((key) => key !== "id")
		.map((key) => `${key}="${obj[key]}"`)
		.join(" ");

export interface UserProfilePicProps {
	className?: string; // class to pass to the post card element
	unicornProfilePicMap: astroHTML.JSX.ImgHTMLAttributes[];
	authors: Array<UnicornInfo>;
}

export const getUserProfilePic = ({
	className,
	authors,
	unicornProfilePicMap,
}: UserProfilePicProps) => {
	const hasTwoAuthors = authors.length !== 1;

	return `
        <div class="${styles.container} ${className || ""}">
        ${authors
					.map((unicorn, i) => {
						const imgArrs = jsxPropsToHTMLAttributes(
							unicornProfilePicMap.find((u) => u.id === unicorn.id)
						);
						const classesToApply = hasTwoAuthors ? styles.twoAuthor : "";

						return `<div
                        class="pointer ${styles.profilePicContainer} ${classesToApply}"
                        style="border-color: ${unicorn.color};"
                    >
                        <img
                            data-testid="author-pic-${i}"
                            alt="${unicorn.name}"
                            class="circleImg ${styles.profilePicImage} ${styles.width50} ${classesToApply}"
                            ${imgArrs}
                        />
                    </div>`;
					})
					.join("")}
        </div>
    `;
};
