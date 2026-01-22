import { PlatformDetector } from "utils/markdown/iframes/platform-detectors/types";
import { getXPostData, xHosts } from "utils/markdown/data-providers";
import { createComponent } from "utils/markdown/components";
import unicornHappy from "assets/unicorn_happy.svg?url";

export const xPlatformDetector: PlatformDetector = {
	detect: (src) => {
		const srcUrl = new URL(src);
		const isX = xHosts.includes(srcUrl.hostname);

		// https://x.com/playful_program/status/1917675872854614490
		const xPathParts = srcUrl.pathname.split("/").filter(Boolean);
		const xStatus = xPathParts[1];
		const isXPost = xStatus === "status";

		return isX && isXPost;
	},
	rehypeTransform: async ({ parent, index, src }) => {
		const srcUrl = new URL(src);
		const xPathParts = srcUrl.pathname.split("/").filter(Boolean);
		const xUserId = xPathParts[0];
		const xPostId = xPathParts[xPathParts.length - 1];

		const post = await getXPostData({
			userId: xUserId,
			postId: xPostId,
		});

		if (!post) {
			// TODO: Handle 404 properly
			return;
		}

		const photo = post?.media?.photos?.[0];
		const picture = photo
			? {
					url: photo.url,
					alt: photo.altText,
					aspectRatio: photo.height / photo.width,
				}
			: undefined;

		parent.children.splice(
			index,
			1,
			createComponent("XPlaceholder", {
				text: post.text,
				handle: post.author.screen_name,
				name: post.author.name,
				link: post.url,
				date: post.created_at,
				profilePic: post.author.avatar_url ?? unicornHappy,
				likes: post.likes,
				reposts: post.reposts,
				replies: post.replies,
				picture,
				// TODO: Handle video, images, et al
			}),
		);
	},
};
