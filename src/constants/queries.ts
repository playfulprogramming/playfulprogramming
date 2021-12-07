import { PickDeep } from "ts-util-helpers";
import { PostInfo } from "types/PostInfo";

export const seriesPostsPick = {
  title: true,
  slug: true,
  series: true,
  order: true,
} as const;

export type SeriesPostInfo = PickDeep<
  true | false,
  PostInfo,
  typeof seriesPostsPick
>;
