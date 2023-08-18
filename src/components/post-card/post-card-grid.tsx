import style from "./post-card-grid.module.scss";
import { PostCard, PostCardExpanded } from "./post-card";
import { PostInfo } from "types/index";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { HTMLAttributes } from "preact/compat";

export interface PostGridProps extends HTMLAttributes<HTMLUListElement> {
	postsToDisplay: PostInfo[];
	unicornProfilePicMap: ProfilePictureMap;
	expanded?: boolean;
}

export function PostCardGrid({
	postsToDisplay,
	unicornProfilePicMap,
	expanded,
	...props
}: PostGridProps) {
	return (
		<ul {...props} class={style.list} role="list" id="post-list-container">
			{postsToDisplay.map((post) => {
				return expanded && post.bannerImg ? (
					<PostCardExpanded
						class={style.expanded}
						post={post}
						unicornProfilePicMap={unicornProfilePicMap}
					/>
				) : (
					<PostCard post={post} unicornProfilePicMap={unicornProfilePicMap} />
				);
			})}
		</ul>
	);
}
