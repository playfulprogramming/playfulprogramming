import styles from "./series-toc.module.scss";
import { useMemo, useState } from "preact/hooks";
import { PostInfo } from "types/PostInfo";
import { getShortTitle } from "./base";

function seperatePostsIntoThirds(seriesPosts: SeriesTocProps["postSeries"]) {
	const posts = [...seriesPosts];
	const firstPosts = posts.splice(0, 2);
	const lastPosts = posts.splice(posts.length - 2, 2);
	return {
		firstPosts,
		middlePosts: posts,
		lastPosts,
	};
}

interface SeriesToCListItem {
	post: PostInfo;
	isActive: boolean;
	className?: string;
}

export const SeriesToCListItem = ({
	post,
	isActive,
	className,
}: SeriesToCListItem) => {
	const liClass = isActive ? styles.isActive : "";

	return (
		<li class={`${liClass || ""} ${className || ""}`} role="listitem">
			<a href={`/posts/${post.slug}`}>
				Part {post.order}: {getShortTitle(post)}
			</a>
		</li>
	);
};

interface SeriesTocProps {
	post: PostInfo;
	postSeries: PostInfo[];
	collectionSlug?: string | null;
}
export const SeriesToC = ({
	post,
	postSeries,
	collectionSlug,
}: SeriesTocProps) => {
	const seriesText = `Part of our series: ${post.series}`;

	const [areMiddlePostsActive, setMiddlePostsActive] = useState(false);

	const { firstPosts, middlePosts, lastPosts } = useMemo(
		() => seperatePostsIntoThirds(postSeries),
		[postSeries]
	);

	const isActiveInMiddle = useMemo(() => {
		return middlePosts.some((middlePost) => middlePost.order === post.order);
	}, [middlePosts, post.order]);

	return (
		<div className={styles.seriesTableOfContent}>
			<div className={styles.seriesHeader}>
				{collectionSlug ? (
					<a href={`/collections/${collectionSlug}`}>{seriesText}</a>
				) : (
					seriesText
				)}
			</div>
			<ol aria-labelledby="series-header" role="list">
				{firstPosts.map((seriesPost, i) => {
					const isActive = post.order === seriesPost.order;

					return (
						<SeriesToCListItem
							key={seriesPost.slug}
							isActive={isActive}
							post={seriesPost}
						/>
					);
				})}
				{middlePosts.length !== 0 ? (
					<>
						<li
							className={
								areMiddlePostsActive
									? styles.displayNone
									: isActiveInMiddle
									? styles.isActive
									: ""
							}
							role="listitem"
						>
							<button
								aria-expanded={false}
								onClick={() => setMiddlePostsActive(true)}
							>
								{middlePosts.length} more parts
							</button>
						</li>
						{middlePosts.map((seriesPost, i) => {
							const isActive = post.order === seriesPost.order;

							return (
								<SeriesToCListItem
									className={areMiddlePostsActive ? "" : styles.displayNone}
									key={seriesPost.slug}
									isActive={isActive}
									post={seriesPost}
								/>
							);
						})}
					</>
				) : null}
				{lastPosts.map((seriesPost, i) => {
					const isActive = post.order === seriesPost.order;

					return (
						<SeriesToCListItem
							key={seriesPost.slug}
							isActive={isActive}
							post={seriesPost}
						/>
					);
				})}
			</ol>
		</div>
	);
};
