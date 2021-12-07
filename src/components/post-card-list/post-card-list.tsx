import React from "react";
import listStyle from "./post-card-list.module.scss";
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
      {postsToDisplay.map((post) => {
        const slug = post.slug;

        const title = post.title || slug;

        return (
          <PostCard
            slug={post.slug}
            key={post.slug}
            excerpt={post.excerpt}
            title={title}
            authors={post.authors}
            published={post.published}
            tags={post.tags}
            description={post.description}
          />
        );
      })}
    </ul>
  );
};
