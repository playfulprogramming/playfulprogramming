import type { PostInfo, CollectionInfo } from "#types/index.ts";
import style from "./article-nav.module.scss";
import arrow_left from "../../../icons/arrow_left.svg?raw";
import arrow_right from "../../../icons/arrow_right.svg?raw";
import { getShortTitle } from "../../../utils/remove-article-collection-prefix.ts";
import { getHrefContainerProps } from "#utils/href-container-script.ts";
import { localizeHref } from "#src/paraglide/runtime.js";
import { m } from "#src/paraglide/messages.js";

type ArticleNavItemProps = {
	post: PostInfo;
	collection?: CollectionInfo;
	type: "next" | "previous";
};

function ArticleNavItem({ post, collection, type }: ArticleNavItemProps) {
	const href = localizeHref(`/posts/${post.slug}`, { locale: post.locale });
	return (
		<div
			class={`${style.item} ${style[`item--${type}`]}`}
			{...getHrefContainerProps(href)}
		>
			{type === "previous" ? (
				<span class={`${style.item__overline} text-style-button-regular`}>
					<span
						class={`${style.icon}`}
						dangerouslySetInnerHTML={{ __html: arrow_left }}
					/>
					{m.action_previous_article()}
				</span>
			) : (
				<span class={`${style.item__overline} text-style-button-regular`}>
					{m.action_next_article()}
					<span
						class={`${style.icon}`}
						dangerouslySetInnerHTML={{ __html: arrow_right }}
					/>
				</span>
			)}
			<a href={href} class="text-style-body-medium-bold">
				{getShortTitle(post, collection)}
			</a>
		</div>
	);
}

export interface ArticleNavProps {
	post: PostInfo;
	collection?: CollectionInfo;
	collectionPosts: PostInfo[];
}

export function ArticleNav({
	post,
	collection,
	collectionPosts,
}: ArticleNavProps) {
	const postIndex = collectionPosts.findIndex((p) => p.order === post.order);

	const prevPost = collectionPosts[postIndex - 1];
	const nextPost = collectionPosts[postIndex + 1];
	return (
		<div class={style.container}>
			{prevPost && (
				<ArticleNavItem
					post={prevPost}
					collection={collection}
					type="previous"
				/>
			)}
			{nextPost && (
				<ArticleNavItem post={nextPost} collection={collection} type="next" />
			)}
		</div>
	);
}
