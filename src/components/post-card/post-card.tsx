// TODO: Add click back to `li`
// TODO: Make user-profile-pic clickable again
import cardStyles from "./post-card.module.scss";
import { PostInfo } from "types/PostInfo";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { Tag } from "components/base";
import { Card } from "components/base/card/card";
import { Picture } from "components/base/image/picture";
import { UnicornTag } from "components/unicorn-tag/unicorn-tag";

interface PostCardProps {
	post: Pick<
		PostInfo,
		"publishedMeta" | "slug" | "title" | "tags" | "description" | "excerpt"
	> & {
		authorsMeta: Array<
			Pick<PostInfo["authorsMeta"][number], "id" | "color" | "name">
		>;
	}; // Info on the authors of the post
	class?: string; // class to pass to the post card element
	unicornProfilePicMap: ProfilePictureMap;
}

export const PostCard = ({
	post,
	class: className = "",
	unicornProfilePicMap,
}: PostCardProps) => {
	const {
		publishedMeta,
		slug,
		title,
		authorsMeta,
		tags,
		description,
		excerpt,
	} = post;

	return (
		<Card tag="li" href={`/posts/${slug}`}>
			<ul class={`unlist-inline gap-2 ${cardStyles.authors}`}>
				{authorsMeta.map((author) => (
					<li>
						<UnicornTag
							unicorn={author}
							unicornProfilePicMap={unicornProfilePicMap}
						/>
					</li>
				))}
			</ul>
			<p class={`${cardStyles.meta} text-style-small`}>{publishedMeta}</p>
			<a href={`/posts/${slug}`} class={cardStyles.header}>
				<h2 class={`text-style-headline-5`}>{title}</h2>
			</a>
			<p
				class={cardStyles.excerpt}
				dangerouslySetInnerHTML={{ __html: description || excerpt }}
			></p>
			<ul class="unlist-inline gap-2">
				{tags.map((tag) => (
					<li>
						<Tag href={`/search?q=${tag}`}>{tag}</Tag>
					</li>
				))}
			</ul>
		</Card>
	);
};
