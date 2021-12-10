export const getSkippedPosts = <T>(posts: T[], skip: number, limit: number) => {
  return posts.slice(skip, skip + limit);
};

export const filterPostsBySlugArr = <T extends { slug: string }>(
  posts: T[],
  allowedIdArr: string[]
) => {
  return posts.filter(({ slug }) => allowedIdArr.includes(slug));
};
