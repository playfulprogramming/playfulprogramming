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
			class={`grid grid-tablet-2 ${style.list}`}
			aria-label={props.listAriaLabel}
			role="list"
			id="post-list-container"
		>
			{postsToDisplay.map((post, i) => {
				const isExpanded = props.expanded && (i === 0 || i === 4);

				return isExpanded ? (
					<PostCardExpanded
						class={style.expanded}
						post={post}
						unicornProfilePicMap={props.unicornProfilePicMap}
					/>
				) : (
					<PostCard post={post} unicornProfilePicMap={props.unicornProfilePicMap} />
				);
			})}
		</ul>
	)
}
