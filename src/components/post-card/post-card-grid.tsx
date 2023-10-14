import style from "./post-card-grid.module.scss";
import { PostCard, PostCardExpanded } from "./post-card";
import { PostInfo } from "types/index";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { HTMLAttributes } from "preact/compat";

export interface PostGridProps extends HTMLAttributes<HTMLUListElement> {
	postsToDisplay: PostInfo[];
	postHeadingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	unicornProfilePicMap: ProfilePictureMap;
	expanded?: boolean;
}

export function PostCardGrid({
	postsToDisplay,
	postHeadingTag,
	unicornProfilePicMap,
	expanded,
	...props
}: PostGridProps) {
	return (
		<ul {...props} class={style.list} role="list" id="post-list-container">
			{postsToDisplay.map((post, i) => {
				return expanded && post.bannerImg ? (
					<PostCardExpanded
						class={style.expanded}
						post={post}
						headingTag={postHeadingTag}
						unicornProfilePicMap={unicornProfilePicMap}
						// images should be loaded eagerly when presented above-the-fold
						imageLoading={i < 4 ? "eager" : "lazy"}
					/>
				) : (
					<PostCard
						post={post}
						headingTag={postHeadingTag}
						unicornProfilePicMap={unicornProfilePicMap}
					/>
				);
			})}
		</ul>
	);
}
