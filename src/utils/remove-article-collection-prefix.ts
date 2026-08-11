import type { PostInfo } from "#types/PostInfo.ts";
import type { CollectionInfo } from "#types/CollectionInfo.ts";

export function getShortTitle(
	post: Pick<PostInfo, "title" | "collection">,
	collection?: CollectionInfo,
): string {
	const collectionTitle = collection?.title || post.collection || "";
	// if the post title starts with its collection title, remove it
	if (post.title.startsWith(`${collectionTitle}: `))
		return post.title.substring(collectionTitle.length + 2);

	return post.title;
}
