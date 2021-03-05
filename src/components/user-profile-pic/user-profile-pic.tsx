import * as React from "react";
import Image from "gatsby-image";

import styles from "./user-profile-pic.module.scss";
import { UnicornInfo } from "../../types";

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
				key={unicorn.id}
				onClick={onClick}
				className={`pointer ${styles.profilePicContainer} ${classesToApply}`}
				style={{
					borderColor: unicorn.color,
				}}
			>
				<Image
					data-testid={`author-pic-${i}`}
					fixed={unicorn.profileImg.childImageSharp.smallPic as any}
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
