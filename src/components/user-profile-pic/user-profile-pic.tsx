import * as React from "react";
import { GatsbyImage } from "gatsby-plugin-image";
import Image from "gatsby-image";

import * as styles from "./user-profile-pic.module.scss";
import { UnicornInfo } from "uu-types";

interface UserProfilePicProps {
	authors: Array<{ unicorn: UnicornInfo; onClick: React.MouseEventHandler }>;
	className: string;
}
export const UserProfilePic = ({ authors, className }: UserProfilePicProps) => {
	const hasTwoAuthors = authors.length !== 1;

	const authorsLinks = authors.map(({ unicorn, onClick }, i) => {
		const classesToApply = hasTwoAuthors ? styles.twoAuthor : "";

		return (
			<div
				key={unicorn.unicornId}
				onClick={onClick}
				className={`pointer ${styles.profilePicContainer} ${classesToApply}`}
				style={{
					borderColor: unicorn.color,
				}}
			>
				<GatsbyImage
					data-testid={`author-pic-${i}`}
					image={unicorn.profileImg.childImageSharp.smallPic}
					alt={unicorn.name}
					className={`circleImg ${styles.profilePicImage} ${classesToApply}`}
					imgStyle={{
						borderRadius: `50%`,
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
