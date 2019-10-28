/**
 * @param {Array} posts
 * @param {number} skip - Number of posts to skip
 * @param {number} limit - Number of posts to limit to
 * @returns {Array} posts that're skipped
 */
export const getSkippedPosts = (posts, skip, limit) => {
	return posts.slice(skip, skip + limit);
};

/**
 * @param {Array} posts
 */
export const filterPostsBySlugArr = (posts, allowedIdArr) => {
	return posts.filter(({ node: { fields: { slug } } }) =>
		allowedIdArr.includes(slug)
	);
};
