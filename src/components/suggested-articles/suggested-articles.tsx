import * as React from "react";
import * as suggestedStyle from "./suggested-articles.module.scss";
import { PostInfo } from "uu-types";
import classnames from "classnames";
import { Link } from "gatsby";

interface TableOfContentsProps {
	suggestedArticles: PostInfo["fields"]["suggestedArticles"];
}

export const SuggestedArticles = ({
	suggestedArticles,
}: TableOfContentsProps) => {
	return (
		<aside aria-label={"Suggested Articles"}>
			<ol role={"list"} className={suggestedStyle.list}>
				<h2 className={suggestedStyle.header}>Related posts</h2>
				{suggestedArticles.map((suggestedArticle, i) => {
					const authorNames = suggestedArticle.authors.join(", ");
					return (
						<li
							key={suggestedArticle.slug}
							className={classnames([
								suggestedStyle.card,
								suggestedStyle.localCard,
							])}
						>
							<Link to={`/posts${suggestedArticle.slug}`}>
								<span className={suggestedStyle.titleTag}>
									{suggestedArticle.title}
								</span>
								<br />
								<span className={suggestedStyle.srOnly}>by</span>
								<span className={suggestedStyle.author}>{authorNames}</span>
							</Link>
						</li>
					);
				})}
			</ol>
		</aside>
	);
};
