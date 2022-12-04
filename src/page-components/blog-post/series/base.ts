import { PostInfo } from "types/PostInfo";

export function getShortTitle(post: PostInfo): string {
	return post.title.replace(new RegExp(`^${post.series}: `), "");
}
