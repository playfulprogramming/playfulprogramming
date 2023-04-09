import { ExtendedPostInfo } from "types/index";

export function getShortTitle(post: ExtendedPostInfo): string {
	const collectionTitle = post.collectionMeta?.title || post.collection;
	// if the post title starts with its collection title, remove it
	if (post.title.startsWith(`${collectionTitle}: `))
		return post.title.substring(collectionTitle.length + 2);

	return post.title;
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
