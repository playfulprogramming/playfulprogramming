import * as React from "react";
import suggestedStyle from "./suggested-articles.module.scss";
import classnames from "classnames";
import Link from "next/link";
import { OrderSuggestPosts } from "utils/useGetSuggestedArticles";
import { AnalyticsLink } from "components/analytics-link";

interface TableOfContentsProps {
  suggestedArticles: OrderSuggestPosts;
}

export const SuggestedArticles = ({
  suggestedArticles,
}: TableOfContentsProps) => {
  if (!suggestedArticles.length) return null;
  return (
    <aside aria-label={"Suggested Articles"}>
      <ol role={"list"} className={suggestedStyle.list}>
        <h2 className={suggestedStyle.header}>Related posts</h2>
        {suggestedArticles.map((suggestedArticle, i) => {
          const authorNames = suggestedArticle.authors
            .map((author) => author.name)
            .join(", ");
          return (
            <li
              key={suggestedArticle.slug}
              className={classnames([
                suggestedStyle.card,
                suggestedStyle.localCard,
              ])}
            >
              <Link href={`/posts/${suggestedArticle.slug}`} passHref>
                <AnalyticsLink
                  category="suggested_article"
                  className={suggestedStyle.aTag}
                >
                  <span className={suggestedStyle.titleTag}>
                    {suggestedArticle.title}
                  </span>
                  <br />
                  <span className={suggestedStyle.srOnly}>by</span>
                  <span className={suggestedStyle.author}> {authorNames}</span>
                </AnalyticsLink>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};
