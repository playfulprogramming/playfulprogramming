import { PlatformDetector } from "utils/markdown/iframes/platform-detectors/types";
import { createComponent } from "utils/markdown/components";
import unicornHappy from "assets/unicorn_happy.svg?url";

export const xPlatformDetector: PlatformDetector = {
	detect: ({ metadata }) => metadata?.embedType === "post",
	rehypeTransform: async ({ parent, index, src, metadata }) => {
		const post = metadata?.post;
		if (!post) {
			parent.children.splice(
				index,
				1,
				createComponent("FourOFourPlaceholder", {
					url: src,
				}),
			);
			return;
		}

		const photo = post?.image;
		const picture = photo
			? {
					url: photo.src,
					alt: photo.altText,
					aspectRatio:
						photo.width && photo.height ? photo.height / photo.width : 1,
				}
			: undefined;

		parent.children.splice(
			index,
			1,
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
				picture,
				// TODO: Handle video, images, et al
			}),
		);
	},
};
