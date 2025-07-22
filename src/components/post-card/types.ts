import { PostInfo, SearchPostInfo } from "types/PostInfo";

export type PostInfoWithBanner = PostInfo & Pick<SearchPostInfo, "banner">;
