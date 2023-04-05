// TODO: Add click back to `li`
// TODO: Make user-profile-pic clickable again
import cardStyles from "./post-card.module.scss";
import { PostInfo } from "types/index";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { Tag } from "components/base";
import { Card } from "components/base/card/card";
import { UnicornTagSmall } from "components/unicorn-tag/unicorn-tag";
import calendar from "src/icons/calendar.svg?raw";

interface PostCardProps {
	post: Pick<
		PostInfo,
		"publishedMeta" | "slug" | "title" | "tags" | "description"
	> & {
		authorsMeta: Array<
			Pick<PostInfo["authorsMeta"][number], "id" | "color" | "name">
		>;
	}; // Info on the authors of the post
	class?: string; // class to pass to the post card element
	unicornProfilePicMap: ProfilePictureMap;
}

function PostCardMeta({
	post, unicornProfilePicMap,
}: PostCardProps) {
	return <>
		<div class={cardStyles.meta}>
			<ul class="unlist-inline gap-2">
				{post.authorsMeta.map((author) => (
					<li>
						<UnicornTagSmall
							unicorn={author}
							unicornProfilePicMap={unicornProfilePicMap}
						/>
					</li>
				))}
			</ul>
			<p class={`d-flex gap-1 ${cardStyles.date}`}>
				<span class="d-flex" dangerouslySetInnerHTML={{ __html: calendar }} />
				{post.publishedMeta}
			</p>
		</div>
		<p
			class={cardStyles.excerpt}
			dangerouslySetInnerHTML={{ __html: post.description }}
		></p>
		<ul class="unlist-inline gap-2">
			{post.tags.map((tag) => (
				<li>
					<Tag href={`/search?q=${tag}`}>{tag}</Tag>
				</li>
			))}
		</ul>
	</>;
}

export const PostCardExpanded = ({
	post,
	class: className = "",
	unicornProfilePicMap,
}: PostCardProps) => {
	return (
		<Card
			tag="li"
			href={`/posts/${post.slug}`}
			class={`${className} ${cardStyles.cardExpanded}`}
		>
			<img
				loading="lazy"
				src={`/generated/${post.slug}.banner.jpg`}
				class={cardStyles.image}
				alt="Computer code and text on a computer screen"
			/>
			<a href={`/posts/${post.slug}`} class={cardStyles.header}>
				<h2 class={`text-style-headline-2`}>{post.title}</h2>
			</a>
			<PostCardMeta
				post={post}
				unicornProfilePicMap={unicornProfilePicMap}
			/>
		</Card>
	);
};

export const PostCard = ({
	post,
	class: className = "",
	unicornProfilePicMap,
}: PostCardProps) => {
	return (
		<Card tag="li" href={`/posts/${post.slug}`} class={`${className}`}>
			<a href={`/posts/${post.slug}`} class={cardStyles.header}>
				<h2 class={`text-style-headline-5`}>{post.title}</h2>
			</a>
			<PostCardMeta
				post={post}
				unicornProfilePicMap={unicornProfilePicMap}
			/>
		</Card>
	);
};
