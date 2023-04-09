import cardStyles from "./post-card-small.module.scss";
import { PostInfo } from "types/index";
import { Card } from "components/base/card/card";

interface PostCardProps {
	post: Pick<
		PostInfo,
		"slug" | "title"
	> & {
		authorsMeta: Array<
			Pick<PostInfo["authorsMeta"][number], "name">
		>;
	}; // Info on the authors of the post
	class?: string; // class to pass to the post card element
}

export const PostCardSmall = ({
	post,
	class: className = "",
}: PostCardProps) => {
	const {
		slug,
		title,
		authorsMeta,
	} = post;

	return (
		<Card tag="li" size="l" href={`/posts/${slug}`} class={className}>
			<a href={`/posts/${slug}`} class={cardStyles.header}>
				<h2 class={`text-style-body-medium-bold`}>{title}</h2>
			</a>
			<span class={`${cardStyles.authors} text-style-body-small-bold`}>
				{authorsMeta.map((author) => author.name).join(", ")}
			</span>
		</Card>
	);
};
