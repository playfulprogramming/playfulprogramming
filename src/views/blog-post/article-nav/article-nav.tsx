import { PostInfo } from "types/PostInfo";
import style from "./article-nav.module.scss";
import arrow_left from "../../../icons/arrow_left.svg?raw";
import arrow_right from "../../../icons/arrow_right.svg?raw";
import { getShortTitle } from "../series/base";

type ArticleNavItemProps = {
	post: PostInfo;
	type: "next" | "previous";
};

function ArticleNavItem({ post, type }: ArticleNavItemProps) {
	const href = `/posts/${post.slug}`;
	return (
		<div
			class={`${style.item} ${style[`item--${type}`]}`}
			data-navigation-path={href}
		>
			{
				type === "previous"
					? (
						<span class={`${style.item__overline} text-style-button-regular`}>
							<span
								style="display: inline-flex;"
								dangerouslySetInnerHTML={{ __html: arrow_left }}
							/>
							Previous article
						</span>
					)
					: (
						<span class={`${style.item__overline} text-style-button-regular`}>
							Next article
							<span
								style="display: inline-flex;"
								dangerouslySetInnerHTML={{ __html: arrow_right }}
							/>
						</span>
					)
			}
			<a href={href} class="text-style-body-medium-bold">{getShortTitle(post)}</a>
		</div>
	)
}

export interface ArticleNavProps {
	post: PostInfo;
	postSeries: PostInfo[];
}

export function ArticleNav({ post, postSeries }: ArticleNavProps) {
	const postIndex = postSeries.findIndex((p) => p.order === post.order);

	const prevPost = postSeries[postIndex - 1];
	const nextPost = postSeries[postIndex + 1];
	return (
		<div class={style.container}>
			{prevPost && <ArticleNavItem post={prevPost} type="previous" />}
			{nextPost && <ArticleNavItem post={nextPost} type="next" />}
		</div>
	)
}
