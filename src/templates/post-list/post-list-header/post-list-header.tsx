import React from "react";
import Image from "gatsby-image";
import styles from "./post-list-header.module.scss";
import { Link } from "gatsby";

interface PostListHeaderProps {
	image: string;
	siteMetadata: {
		description: string;
	};
}
export const PostListHeader = ({
	image,
	siteMetadata
}: PostListHeaderProps) => {
	return (
		<div
			className={styles.container}
			role="banner"
			aria-label={`Banner for Unicorn Utterances`}
		>
			<Image
				className={styles.headerPic}
				fixed={image as any}
				loading={"eager"}
				alt={`Unicorn Utterances header image`}
			/>
			<div className={styles.noMgContainer}>
				<h1 className={styles.title}>Unicorn Utterances</h1>
				<div
					className={styles.subheader}
					aria-label={"The site's about snippet"}
				>
					{siteMetadata.description}
					<br />
					<Link to={"/about"}>About Us</Link>
				</div>
			</div>
		</div>
	);
};
