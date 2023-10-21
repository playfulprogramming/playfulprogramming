import { PostInfo, Languages } from "types/index";
import { getPostsByLang } from "./api";

/**
 * Get 3 similar articles to suggest in sidebar.
 * Base off of article series,and similar tags.
 * If neither apply, simply grab latest articles
 *
 * However, they should take the precedence. If there are
 * series articles, they should suggest higher than
 * matching tags
 *
 * We check exactly how similar tags are in general. For example, given one
 * post with 4 tags that match, and another post with only 2, the one with
 * 4 tags will show above the one with 2.
 *
 * For suggested articles, get the articles only within
 * 1 series order of each other.
 *
 * So, if we got "2", we could get:
 * 1, 3, 4
 *
 * But not:
 * 1, 3, 5
 *
 * Or, alternatively, if we got "3", we could get:
 * 1, 2, 4
 *
 * But not:
 * 1, 4, 5
 */
const howManySimilarBetween = <T>(arr1: T[], arr2: T[]): number => {
	let match = 0;
	for (const item of arr1) {
		if (arr2.includes(item)) match++;
	}
	return match;
};

const getOrderRange = (arr: PostInfo[]) => {
	return arr.reduce(
		(prev, curr) => {
			if (!prev.smallest || !prev.largest) {
				return {
					largest: curr,
					smallest: curr,
				};
			}
			if (
				curr.order !== undefined &&
				prev.smallest.order !== undefined &&
				curr.order < prev.smallest.order
			) {
				prev.smallest = curr;
			}
			if (
				curr.order !== undefined &&
				prev.largest.order !== undefined &&
				curr.order > prev.largest.order
			) {
				prev.largest = curr;
			}
			return prev;
		},
		{
			largest: undefined as PostInfo | undefined,
			smallest: undefined as PostInfo | undefined,
		},
	);
};

export const getSuggestedArticles = (postNode: PostInfo) => {
	const suggestedPosts = getPostsByLang(postNode.locale);

	const extraSuggestedArticles: PostInfo[] = [];
	const suggestedArticles: PostInfo[] = [];
	const similarTags: Array<{
		post: PostInfo;
		howManyTagsSimilar: number;
	}> = [];
	for (const post of suggestedPosts) {
		// Early "return" for value
		if (suggestedArticles.length >= 3) break;
		// Don't return the same article
		if (post.slug === postNode.slug) continue;

		if (!!post.collection && post.collection === postNode.collection) {
			const { largest, smallest } =
				getOrderRange([...suggestedArticles, postNode]) || {};

			let newArticlePushed = false;
			if (
				largest &&
				smallest &&
				(post.order === smallest.order! - 1 ||
					post.order === largest.order! + 1)
			) {
				suggestedArticles.push(post);
				newArticlePushed = false;
			}
			/**
			 * Because we've just updated the `largest` and `smallest`, it's possible
			 * there's another match in our list of suggested articles. Go check
			 *
			 * This may seem bad to do a while loop here, but I promise that we'll
			 * never have a series longer than even, like, 20 articles. This is a massive
			 * improvement over looping through the entire list of articles.
			 */
			while (newArticlePushed) {
				if (suggestedArticles.length >= 3) break;
				if (extraSuggestedArticles.length === 0) break;
				const { largest, smallest } = getOrderRange(suggestedArticles) || {};
				for (const suggestedPost of extraSuggestedArticles) {
					if (
						largest &&
						smallest &&
						(suggestedPost.order === smallest.order! - 1 ||
							suggestedPost.order === largest.order! + 1)
					) {
						suggestedArticles.push(suggestedPost);
					}
				}
			}
			if (suggestedArticles.length >= 3) break;
			extraSuggestedArticles.push(post);
		}
		const howManyTagsSimilar = howManySimilarBetween(
			post.tags,
			postNode.tags || [],
		);
		if (howManyTagsSimilar > 0) {
			similarTags.push({ post, howManyTagsSimilar });
		}
	}

	// Check to see if there are at least three suggested articles.
	// If not, fill it with another array of suggested articles.
	const fillSuggestionArrayWith = (otherArr: PostInfo[]) => {
		if (suggestedArticles.length < 3) {
			let sizeToPush = 3 - suggestedArticles.length;
			for (const item of otherArr) {
				// Handle non-blog content, like about page
				if (!item?.published) continue;
				// Don't suggest itself
				if (item.slug === postNode.slug) continue;
				// No duplicates, please!
				if (suggestedArticles.includes(item)) continue;
				suggestedArticles.push(item);
				sizeToPush--;
				if (sizeToPush <= 0) return;
			}
		}
	};

	const tagSimilaritySorted = similarTags
		.sort((a, b) => b.howManyTagsSimilar - a.howManyTagsSimilar)
		.map(({ post }) => post);
	fillSuggestionArrayWith(tagSimilaritySorted);

	fillSuggestionArrayWith(suggestedPosts);

	return suggestedArticles;
};
