import { PostInfo } from "types/PostInfo";

export const getSkippedPosts = (
  posts: PostInfo[],
  skip: number,
  limit: number
) => {
  return posts.slice(skip, skip + limit);
};

export const filterPostsBySlugArr = (
  posts: PostInfo[],
  allowedIdArr: string[]
) => {
  return posts.filter(({ slug }) => allowedIdArr.includes(slug));
};
