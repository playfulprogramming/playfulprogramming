import style from "./post-card-grid.module.scss";
import { PostCard } from "./post-card";
import { PostInfo } from "types/PostInfo";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";

export interface PostGridProps {
	unicornData?: PostInfo["authorsMeta"];
	listAriaLabel: string;
	postsToDisplay: PostInfo[];
	unicornProfilePicMap: ProfilePictureMap;
}

export function PostCardGrid({ postsToDisplay, ...props }: PostGridProps) {
	return (
		<ul
			class={`grid grid-2 ${style.list}`}
			aria-label={props.listAriaLabel}
			role="list"
			id="post-list-container"
		>
			{postsToDisplay.map((post) => (
				<PostCard post={post} unicornProfilePicMap={props.unicornProfilePicMap} />
			))}
		</ul>
	)
}
