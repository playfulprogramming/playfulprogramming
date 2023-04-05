import { ExtendedPostInfo } from "types/index";

export function getShortTitle(post: ExtendedPostInfo): string {
	return post.title.replace(new RegExp(`^${post.series}: `), "");
}

export function seperatePostsIntoThirds(seriesPosts: ExtendedPostInfo[]) {
	const posts = [...seriesPosts];
	const firstPosts = posts.splice(0, 2);
	const lastPosts = posts.splice(posts.length - 2, 2);
	return {
		firstPosts,
		middlePosts: posts,
		lastPosts,
	};
}
