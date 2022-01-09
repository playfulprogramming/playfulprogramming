import { PickDeep } from "ts-util-helpers";
import { PostInfo } from "types/PostInfo";

export const seriesPostsPick = {
  title: true,
  slug: true,
  series: true,
  order: true,
} as const;

export type SeriesPostInfo = PickDeep<PostInfo, typeof seriesPostsPick>;

export const postBySlug = {
  title: true,
  slug: true,
  content: true,
  wordCount: true,
  series: true,
  order: true,
  originalLink: true,
  tags: true,
  edited: true,
  published: true,
  authors: true,
  description: true,
  excerpt: true,
  license: true,
} as const;

export type SlugPostInfo = PickDeep<PostInfo, typeof postBySlug>;
