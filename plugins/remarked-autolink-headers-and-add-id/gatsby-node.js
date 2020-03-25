const flatFilter = require("unist-util-flat-filter");
const parse = require("@textlint/markdown-to-ast").parse;
const deburr = require(`lodash/deburr`);

/**
 * While I would much MUCH rather utilize the existing AST manipulation from
 * the remarked plugin, we've hit a bit of a snag. The problem is explained here:
 * https://github.com/gatsbyjs/gatsby/issues/22287
 *
 * Once this issue is resolved/workedaround, we can move back to the code that
 * was previously confirmed working here:
 * https://github.com/unicorn-utterances/unicorn-utterances/tree/4efc6216f0efc228ced5c6e5491cb8b77cb64c55/plugins/remarked-autolink-headers-and-add-id
 */

/**
 * Copied directly from the plugin source:
 * https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers/src/index.js#L30-L49
 */
const getId = node => {
	let id;
	if (node.children.length > 0) {
		const last = node.children[node.children.length - 1];
		// This regex matches to preceding spaces and {#custom-id} at the end of a string.
		// Also, checks the text of node won't be empty after the removal of {#custom-id}.
		const match = /^(.*?)\s*\{#([\w-]+)\}$/.exec(toString(last));
		if (match && (match[1] || node.children.length > 1)) {
			id = match[2];
			// Remove the custom ID from the original text.
			if (match[1]) {
				last.value = match[1];
			} else {
				node.children.pop();
			}
		}
	}
	if (!id) {
		const slug = slugs.slug(toString(node), true);
		id = deburr(slug);
	}
	return id;
};

// Hand-written regex
const anchorRegex = /^(.*?)(?:\s*\{#([\w-]+)\})?$/;

exports.sourceNodes = ({ getNodesByType, actions }) => {
	const postNodes = getNodesByType(`MarkdownRemark`);
	const { createNodeField } = actions;

	postNodes.forEach(postNode => {
		const slugs = require(`github-slugger`)();

		const markdownAST = parse(postNode.rawMarkdownBody);
		const values = flatFilter(markdownAST, node => node.type === "Header");

		const headings = values.children.map(node => {
			const headingText = node.children
				.filter(child => child.value)
				.map(child => child.value)
				.join("");

			let [_, headingTrueText, headerId] =
				anchorRegex.exec(headingText) || [];

			if (!headerId) {
				const slug = slugs.slug(headingTrueText, true);
				headerId = deburr(slug);
			}

			return {
				value: headingTrueText,
				depth: node.depth,
				// This is added by the `gatsby-remark-autolink-headers` plugin, we're just using it here
				// This means that it must come after that plugin in your config file
				slug: headerId
			};
		});

		createNodeField({
			name: `headingsWithId`,
			node: postNode,
			value: headings
		});
	});
};
