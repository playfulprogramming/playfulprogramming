import { CollectionInfo, PostInfo } from "types/index";

export function getShortTitle(
	post: PostInfo,
	collection?: CollectionInfo,
): string {
	const collectionTitle = collection?.title || post.collection || "";
	// if the post title starts with its collection title, remove it
	if (post.title.startsWith(`${collectionTitle}: `))
		return post.title.substring(collectionTitle.length + 2);

	return post.title;
}

interface ActivePostMeta extends PostInfo {
	shouldShowInitially: boolean;
	isActive: boolean;
}

export function findActivePost(post: PostInfo, seriesPosts: PostInfo[]) {
	const newPosts = [...seriesPosts] as ActivePostMeta[];

	let isActiveFirst = false;
	let isActiveLast = false;

	for (let i = 0; i < newPosts.length; i++) {
		// Defaults
		newPosts[i].isActive = false;
		newPosts[i].shouldShowInitially = false;

		// Is the active post immediately behind us, is us, or is immediately after us?
		if (
			newPosts[i - 1]?.order === post.order ||
			newPosts[i].order === post.order ||
			newPosts[i + 1]?.order === post.order
		) {
			newPosts[i].shouldShowInitially = true;
		}

		if (newPosts[i].order === post.order) {
			newPosts[i].isActive = true;
			if (i === 0) {
				isActiveFirst = true;
			}
			if (i === newPosts.length - 1) {
				isActiveLast = true;
			}
		}
	}

	/**
	 * To prevent only two posts being active (immediately before/after),
	 * edgecase the first and last posts to select the correct shown posts
	 */
	if (isActiveFirst && newPosts[2]) {
		newPosts[2].shouldShowInitially = true;
	}

	if (isActiveLast && newPosts[newPosts.length - 1 - 2]) {
		newPosts[newPosts.length - 1 - 2].shouldShowInitially = true;
	}

	return newPosts;
}
