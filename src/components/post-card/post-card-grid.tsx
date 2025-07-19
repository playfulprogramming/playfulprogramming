import style from "./post-card-grid.module.scss";
import { PostCard, PostCardExpanded } from "./post-card";
import { PersonInfo } from "types/index";
import { HTMLAttributes } from "preact/compat";
import { isDefined } from "utils/is-defined";
import { PostInfoWithBanner } from "./types";

export interface PostGridProps extends HTMLAttributes<HTMLUListElement> {
	postsToDisplay: PostInfoWithBanner[];
	postAuthors: Map<string, PersonInfo>;
	postHeadingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	expanded?: boolean;
}

export function PostCardGrid({
	postsToDisplay,
	postAuthors,
	postHeadingTag,
	expanded,
	...props
}: PostGridProps) {
	return (
		<ul {...props} class={style.list} role="list" id="post-list-container">
			{postsToDisplay.map((post, i) => {
				const authors = post.authors
					.map((id) => postAuthors.get(id))
					.filter(isDefined);

				const pageIndex = i % 8;

				return expanded && post.banner && (pageIndex == 0 || pageIndex == 4) ? (
					<PostCardExpanded
						class={style.expanded}
						post={post}
						authors={authors}
						headingTag={postHeadingTag}
						// images should be loaded eagerly when presented above-the-fold
						imageLoading={i < 4 ? "eager" : "lazy"}
					/>
				) : (
					<PostCard post={post} authors={authors} headingTag={postHeadingTag} />
				);
			})}
		</ul>
	);
}
