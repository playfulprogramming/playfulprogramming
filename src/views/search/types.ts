import { CollectionInfo } from "types/CollectionInfo";
import { PostInfo } from "types/PostInfo";
import { UnicornInfo } from "types/UnicornInfo";

export interface ServerReturnType {
	unicorns: Record<string, UnicornInfo>;
	posts: PostInfo[];
	totalPosts: number;
	collections: CollectionInfo[];
	totalCollections: number;
}
