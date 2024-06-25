import { PostInfo, CollectionInfo } from "types/index";
import style from "./article-nav.module.scss";
import arrow_left from "../../../icons/arrow_left.svg?raw";
import arrow_right from "../../../icons/arrow_right.svg?raw";
import { getShortTitle } from "../series/base";
import { getHrefContainerProps } from "utils/href-container-script";

type ArticleNavItemProps = {
	post: PostInfo;
	collection?: CollectionInfo;
	type: "next" | "previous";
};

function ArticleNavItem({ post, collection, type }: ArticleNavItemProps) {
	const href = `/posts/${post.slug}`;
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
					Previous article
				</span>
			) : (
				<span class={`${style.item__overline} text-style-button-regular`}>
					Next article
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
