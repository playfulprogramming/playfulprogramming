import { RehypeEmbedTransformProps } from "./types";
import { ComponentNode, createComponent } from "utils/markdown/components";
import unicornHappy from "assets/unicorn_happy.svg?url";

export function rehypeTransformPost({
	src,
	embed,
}: RehypeEmbedTransformProps<"post">): ComponentNode[] {
	const post = embed.post;
	if (!post) {
		return [
			createComponent("FourOFourPlaceholder", {
				url: src,
			}),
		];
	}

	return [
		createComponent("XPlaceholder", {
			text: post.content,
			handle: post.author.handle,
			name: post.author.name,
			link: post.url,
			date: post.createdAt,
			profilePic: post.author.avatar?.src ?? unicornHappy,
			likes: post.numLikes,
			reposts: post.numReposts,
			replies: post.numReplies,
			picture: post?.image,
			// TODO: Handle video, images, et al
		}),
	];
}
