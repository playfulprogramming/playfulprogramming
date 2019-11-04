import * as React from "react";
import Image from "gatsby-image";
import { Link } from "gatsby";

import { stopPropCallback } from "../../utils/preventCallback";
import styles from "./user-profile-pic.module.scss";

/**
 * @param {Array.<{unicorn: UnicornInfo, onClick: MouseEventHandler}>} authors
 * @param {string} className
 */
export const UserProfilePic = ({ authors, className }) => {
	const hasTwoAuthors = authors.length !== 1;

	const authorsLinks = authors.map(({ unicorn, onClick }, i) => {
		const classesToApply = hasTwoAuthors ? styles.twoAuthor : "";

		return (
			<div
				key={unicorn.id}
				onClick={onClick}
				className={`pointer ${styles.profilePicContainer} ${classesToApply}`}
				style={{
					borderColor: unicorn.color
				}}
			>
				<Image
					data-testid={`author-pic-${i}`}
					fixed={unicorn.profileImg.childImageSharp.smallPic}
					alt={unicorn.name}
					className={`circleImg ${styles.profilePicImage} ${classesToApply}`}
					imgStyle={{
						borderRadius: `50%`
					}}
				/>
			</div>
		);
	});

	return (
		<div className={`${styles.container} ${className || ""}`}>
			{authorsLinks}
		</div>
	);
};
