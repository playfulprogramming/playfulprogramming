import { PostInfo } from "types/PostInfo";

interface SeriesToCListItem {
	post: PostInfo;
	isActive: boolean;
	className?: string;
}

function getShortTitle(post: PostInfo): string {
	return post.title.replace(new RegExp(`^${post.series}: `), "");
}

export const SeriesToCListItem = ({
	post,
	isActive,
	className,
}: SeriesToCListItem) => {
	// const liClass = isActive ? styles.isActive : "";
	const liClass = "";

	return (
		<li class={`${liClass || ""} ${className || ""}`} role="listitem">
			<a href={`/posts/${post.slug}`}>
				Part {post.order}: {getShortTitle(post)}
			</a>
		</li>
	);
};
