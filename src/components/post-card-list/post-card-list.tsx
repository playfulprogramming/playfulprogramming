import React from "react";
import * as listStyle from "./post-card-list.module.scss";
import { PostCard } from "../post-card";
import { UnicornInfo } from "uu-types";
import { PostListContext } from "constants/post-list-context";

export interface PostListProps {
	showWordCount?: boolean;
	numberOfArticles?: number;
	wordCount?: number;
	unicornData?: UnicornInfo;
	listAriaLabel: string;
}
/**
 * unicornData - The data with the associated post. If present - you're on profile page
 */
export const PostList = ({ listAriaLabel }: PostListProps) => {
	const { postsToDisplay } = React.useContext(PostListContext);

	return (
		<ul
			className={listStyle.postsListContainer}
			aria-label={listAriaLabel}
			role="list"
		>
			{postsToDisplay.map(({ node }) => {
				const slug = node.fields.slug;

				const title = node.frontmatter.title || slug;
				return (
					<PostCard
						slug={node.fields.slug}
						key={node.fields.slug}
						excerpt={node.excerpt}
						title={title}
						authors={node.frontmatter.authors}
						published={node.frontmatter.published}
						tags={node.frontmatter.tags}
						description={node.frontmatter.description}
					/>
				);
			})}
		</ul>
	);
};
