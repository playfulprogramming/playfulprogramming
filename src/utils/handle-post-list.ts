export const getSkippedPosts = (posts: any[], skip: number, limit: number) => {
	return posts.slice(skip, skip + limit);
};

export const filterPostsBySlugArr = (posts: any[], allowedIdArr: string[]) => {
	return posts.filter(({ node: { fields: { slug } } }) =>
		allowedIdArr.includes(slug)
	);
};
