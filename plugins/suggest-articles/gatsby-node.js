/**
 * While I would much MUCH rather utilize the existing AST manipulation from
 * the remarked plugin, we've hit a bit of a snag. The problem is explained here:
 * https://github.com/gatsbyjs/gatsby/issues/22287
 *
 * Once this issue is resolved/workedaround, we can move back to the code that
 * was previously confirmed working here:
 * https://github.com/unicorn-utterances/unicorn-utterances/tree/c6d64a44ee8a4e7d6cad1dbd2d01bc9a6ad78241/plugins/count-inline-code
 */

const unicorns = require("../../content/data/unicorns.json");
/**
 * Get 3 similar articles to suggest in sidebar.
 * Base off of article series,and similar tags.
 * If neither apply, simply grab latest articles
 *
 * However, they should take the precedence. If there are
 * series articles, they should suggest higher than
 * matching tags
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
const howManySimilarBetween = (arr1, arr2) => {
	let match = 0;
	for (let item of arr1) {
		if (arr2.includes(item)) match++;
	}
	return match;
};

const getOrderRange = (arr) => {
	return arr.reduce((prev, curr) => {
		if (prev === null) {
			return {
				largest: curr,
				smallest: curr,
			};
		}
		if (curr.order < prev.smallest.order) {
			prev.smallest = curr;
		}
		if (curr.order > prev.largest.order) {
			prev.largest = curr;
		}
		return prev;
	}, null);
};

exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions;
	const typeDefs = `
    type MarkdownRemarkFields implements Node {
      suggestedArticles: [SuggestedArticles]
    }
    
		type SuggestedArticles {
      id: String!
      title: String!
      slug: String!
      authors: [String]
    }
  `;
	// TODO: Replace with https://www.gatsbyjs.com/docs/reference/config-files/actions/#createFieldExtension
	createTypes(typeDefs);
};

exports.sourceNodes = ({ getNodesByType, actions }) => {
	const postNodes = getNodesByType(`MarkdownRemark`);
	const { createNodeField } = actions;
	postNodes.forEach((postNode) => {
		let extraSuggestedArticles = [];
		let suggestedArticles = [];
		let similarTags = [];
		for (let post of postNodes) {
			// Early "return" for value
			if (suggestedArticles.length >= 3) break;
			// Handle non-blog content, like about page
			if (!post.frontmatter.published) continue;
			// Don't return the same article
			if (post.id === postNode.id) continue;
			if (post.frontmatter.series === postNode.frontmatter.series) {
				const { largest, smallest } = getOrderRange(suggestedArticles) || {};
				let newArticlePushed = false;
				if (post.order === smallest - 1 || post.order === largest + 1) {
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
					for (let suggestedPost of extraSuggestedArticles) {
						if (
							suggestedPost.order === smallest - 1 ||
							suggestedPost.order === largest + 1
						) {
							suggestedArticles.push(suggestedPost);
						}
					}
				}
				if (suggestedArticles.length >= 3) break;
				extraSuggestedArticles.push(post);
			}
			const howManyTagsSimilar = howManySimilarBetween(
				post.frontmatter.tags,
				postNode.frontmatter.tags || []
			);
			if (howManyTagsSimilar > 0) {
				similarTags.push({ post, howManyTagsSimilar });
			}
		}

		// Check to see if there are at least three suggested articles.
		// If not, fill it with another array of suggested articles.
		const fillSuggestionArrayWith = (otherArr) => {
			if (suggestedArticles.length < 3) {
				let sizeToPush = 3 - suggestedArticles.length;
				for (const item of otherArr) {
					// Don't suggest itself
					if (item.id === postNode.id) continue;
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

		const dateSorted = postNodes.sort((postA, postB) => {
			return (
				// Newest first
				new Date(postB.frontmatter.published) -
				new Date(postA.frontmatter.published)
			);
		});
		fillSuggestionArrayWith(dateSorted);

		const unicorns = require("../../content/data/unicorns.json");

		createNodeField({
			node: postNode,
			name: `suggestedArticles`,
			// TODO: Migrate to `RemarkMarkdown` type. Gatbsy doesn't seem to like
			value: suggestedArticles.map((post) => {
				const authors = (post.frontmatter.authors || []).map((authorID) => {
					return unicorns.find((unicorn) => unicorn.id === authorID).name;
				});
				return {
					id: post.id,
					slug: post.fields.slug,
					title: post.frontmatter.title,
					// Array of IDs
					authors: authors,
				};
			}),
		});
	});
};
