import type { PostInfo, SearchPostInfo } from "#types/PostInfo.ts";

export type PostInfoWithBanner = PostInfo & Pick<SearchPostInfo, "banner">;
