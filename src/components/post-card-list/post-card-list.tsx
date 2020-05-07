import React from "react";
import listStyle from "./post-card-list.module.scss";
import { PostCard } from "../post-card";
import { FilterSearchBar } from "../filter-search-bar";
import { UnicornInfo } from "uu-types";
import { PostListContext } from "constants/post-list-context";

export interface PostListProps {
	showWordCount?: boolean;
	numberOfArticles?: number;
	wordCount?: number;
	unicornData?: UnicornInfo;
}
/**
 * unicornData - The data with the associated post. If present - you're on profile page
 */
export const PostList = ({
	showWordCount = false,
	numberOfArticles,
	wordCount,
	unicornData
}: PostListProps) => {
	const { postsToDisplay: posts, postTags } = React.useContext(PostListContext);

	const listAria = unicornData
		? `List of posts written by ${unicornData.name}`
		: `List of posts`;

	return (
		<main>
			<FilterSearchBar
				tags={postTags}
				showWordCount={showWordCount}
				wordCount={wordCount}
				numberOfArticles={numberOfArticles}
			/>
			<ul
				className={listStyle.postsListContainer}
				aria-label={listAria}
				role="list"
			>
				{posts.map(({ node }) => {
					const slug = node.fields.slug;

					const title = node.frontmatter.title || slug;
					return (
						<PostCard
							slug={node.fields.slug}
							className={listStyle.postListItem}
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
		</main>
	);
};
