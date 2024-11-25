import { PostInfo } from "types/PostInfo";
import { CollectionInfo } from "types/CollectionInfo";

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
