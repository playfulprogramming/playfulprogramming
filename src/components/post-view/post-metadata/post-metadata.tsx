import React, { createRef, useMemo } from "react";
import styles from "./post-metadata.module.scss";
import { Link } from "gatsby";
import { stopPropCallback } from "../../../utils/preventCallback";
import { UserProfilePic } from "../../user-profile-pic";

export const PostMetadata = ({ post }) => {
	const { authors } = post.frontmatter;

	const authorLinks = useMemo(
		() =>
			authors.map(unicorn => {
				const ref = createRef();
				const onClick = e => {
					stopPropCallback(e);
					ref.current.click();
				};

				return {
					unicorn,
					onClick,
					ref
				};
			}),
		[authors]
	);

	return (
		<div className={styles.container}>
			<UserProfilePic
				authors={authorLinks}
				className={styles.authorImagesContainer}
			/>
			<div className={styles.textDiv}>
				<h2 className={styles.authorName} data-testid="post-meta-author-name">
					{authors.map((author, i) => {
						return (
							<React.Fragment key={author.id}>
								<span>{i !== 0 && ", "}</span>
								<Link
									key={author.id}
									to={`/unicorns/${author.id}`}
									ref={authorLinks[i].ref}
									className={styles.authorLink}
								>
									{author.name}
								</Link>
							</React.Fragment>
						);
					})}
				</h2>
				<div className={styles.belowName}>
					<p>{post.frontmatter.published}</p>
					<p>{post.wordCount.words} words</p>
				</div>
			</div>
		</div>
	);
};
