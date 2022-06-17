import { SeriesPostInfo } from "constants/queries";

export function getShortTitle(post: SeriesPostInfo): string {
  return post.title.replace(new RegExp(`^${post.series}: `), "");
}
