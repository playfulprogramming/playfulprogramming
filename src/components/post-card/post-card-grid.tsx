import style from "./post-card-grid.module.scss";
import { PostCard, PostCardExpanded } from "./post-card";
import { PostInfo } from "types/index";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";

export interface PostGridProps {
	listAriaLabel: string;
	postsToDisplay: PostInfo[];
	unicornProfilePicMap: ProfilePictureMap;
	expanded?: boolean;
}

export function PostCardGrid({ postsToDisplay, ...props }: PostGridProps) {
	return (
		<ul
			class={style.list}
			aria-label={props.listAriaLabel}
			role="list"
			id="post-list-container"
		>
			{postsToDisplay.map((post) => {
				return props.expanded && post.bannerImg ? (
					<PostCardExpanded
						class={style.expanded}
						post={post}
						unicornProfilePicMap={props.unicornProfilePicMap}
					/>
				) : (
					<PostCard
						post={post}
						unicornProfilePicMap={props.unicornProfilePicMap}
					/>
				);
			})}
		</ul>
	);
}
