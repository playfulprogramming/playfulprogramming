/**
 * While I would much MUCH rather utilize the existing AST manipulation from
 * the remarked plugin, we've hit a bit of a snag. The problem is explained here:
 * https://github.com/gatsbyjs/gatsby/issues/22287
 *
 * Once this issue is resolved/workedaround, we can move back to the code that
 * was previously confirmed working here:
 * https://github.com/unicorn-utterances/unicorn-utterances/tree/c6d64a44ee8a4e7d6cad1dbd2d01bc9a6ad78241/plugins/count-inline-code
 */
const flatFilter = require("unist-util-flat-filter");
const parse = require("@textlint/markdown-to-ast").parse;

exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions;
	const typeDefs = `
    type MarkdownRemarkFields implements Node {
      inlineCount: Int
    }
  `;
	createTypes(typeDefs);
};
exports.sourceNodes = ({ getNodesByType, actions }) => {
	const postNodes = getNodesByType(`MarkdownRemark`);
	const { createNodeField } = actions;
	postNodes.forEach(postNode => {
		const markdownAST = parse(postNode.rawMarkdownBody);
		const inlineCodeAST = flatFilter(markdownAST, node => node.type === "Code");
		let inlineWords = 0;
		if (inlineCodeAST && inlineCodeAST.children) {
			inlineWords = inlineCodeAST.children
				// Prevent grabbing from https://github.com/nullhook/gatsby-remark-video
				.filter(child => !child.value.startsWith("video:"))
				.reduce((numberOfInline, inlineCodeNode) => {
					const { value } = inlineCodeNode;
					const words = value.split(/\b/g);
					return numberOfInline + words.length;
				}, 0);
		}

		createNodeField({
			name: `inlineCount`,
			node: postNode,
			value: inlineWords
		});
	});
};
