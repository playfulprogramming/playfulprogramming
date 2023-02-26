// TODO: Add click back to `li`
// TODO: Make user-profile-pic clickable again
import cardStyles from "./post-card.module.scss";
import { UserProfilePic } from "../user-profile-pic/user-profile-pic";
import { PostInfo } from "types/PostInfo";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { Tag } from "components/styled";
import { Card } from "components/styled/card/card";
import { Picture } from "components/styled/image/picture";

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
			<p class={`${cardStyles.meta} text-style-small`}>{publishedMeta}</p>
			<a href={`/posts/${slug}`} class={cardStyles.header}>
				<h2 class={`text-style-headline-5`}>{title}</h2>
			</a>
			<ul class={cardStyles.authors}>
				{authorsMeta.map((author) => (
					<li>
						<Tag
							href={`/unicorns/${author.id}`}
							picture={unicornProfilePicMap.find((u) => u.id === author.id)}
							alt={author.name}
						>
							{author.name}
						</Tag>
					</li>
				))}
			</ul>
			<p
				class={cardStyles.excerpt}
				dangerouslySetInnerHTML={{ __html: description || excerpt }}
			></p>
			<ul class={cardStyles.tags}>
				{tags.map((tag) => ( // TODO: link this tag href to search page
					<li>
						<Tag href="#">{tag}</Tag>
					</li>
				))}
			</ul>
		</Card>
	);
};
