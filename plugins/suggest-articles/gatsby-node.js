/**
 * While I would much MUCH rather utilize the existing AST manipulation from
 * the remarked plugin, we've hit a bit of a snag. The problem is explained here:
 * https://github.com/gatsbyjs/gatsby/issues/22287
 *
 * Once this issue is resolved/workedaround, we can move back to the code that
 * was previously confirmed working here:
 * https://github.com/unicorn-utterances/unicorn-utterances/tree/c6d64a44ee8a4e7d6cad1dbd2d01bc9a6ad78241/plugins/count-inline-code
 */

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
const arraysContainSimilar = (arr1, arr2) => arr1.some((r) => arr2.includes(r));

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
      suggestedArticles: Node[]
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
			// Early return for value
			if (suggestedArticles.length >= 3) break;
			// Don't return the same article
			if (post.id === postNode.id) break;
			if (post.frontmatter.series === postNode.frontMatter.series) {
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
			// TODO: Should we consider making more than a single tag match?
			// FWIW I don't know the answer. I'm leaning "no" for now, but "yes" in future
			// when we have more content on the site
			if (arraysContainSimilar(post.tags, postNode.tags)) {
				similarTags.push(post);
			}
		}

		// Check to see if there are at least three suggested articles.
		// If not, fill it with another array of suggested articles.
		const fillSuggestionArrayWith = (otherArr) => {
			if (suggestedArticles.length < 3) {
				const sizeToPush = 3 - suggestedArticles.length;
				suggestedArticles = suggestedArticles.concat(
					otherArr.slice(0, sizeToPush)
				);
			}
		};

		fillSuggestionArrayWith(similarTags);
		// TODO: Sort based on date
		fillSuggestionArrayWith(postNodes);

		createNodeField({
			node: postNode,
			name: `suggestedArticles`,
			value: suggestedArticles,
		});
	});
};
