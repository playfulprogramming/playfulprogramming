import React, { createRef, useMemo } from "react";
import * as styles from "./post-metadata.module.scss";
import { Link } from "gatsby";
import { stopPropCallback } from "uu-utils";
import { PostInfo } from "uu-types";
import { UserProfilePic } from "components/user-profile-pic";

interface PostMetadataProps {
	post: PostInfo;
}
export const PostMetadata = ({ post }: PostMetadataProps) => {
	const { authors } = post.frontmatter;

	const authorLinks = useMemo(
		() =>
			authors.map((unicorn) => {
				const ref = createRef<HTMLElement>();
				const onClick = (e: MouseEvent) => {
					stopPropCallback(e);
					ref.current!.click();
				};

				return {
					unicorn,
					onClick,
					ref,
				};
			}),
		[authors]
	);

	return (
		<div className={styles.container}>
			<UserProfilePic
				authors={authorLinks as any}
				className={styles.postMetadataAuthorImagesContainer}
			/>
			<div className={styles.textDiv}>
				<h2 className={styles.authorName} data-testid="post-meta-author-name">
					<span>by </span>
					{authors.map((author, i) => {
						return (
							<React.Fragment key={author.id}>
								{i !== 0 && <span>{", "}</span>}
								<Link
									key={author.id}
									to={`/unicorns/${author.id}`}
									ref={authorLinks[i].ref as any}
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
					<p>{post.wordCount.words + post.fields.inlineCount} words</p>
				</div>
			</div>
		</div>
	);
};
