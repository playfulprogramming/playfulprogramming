const flatFilter = require("unist-util-flat-filter");

const addInlineCount = ({ markdownAST, actions, markdownNode, ...props }) => {
	const { createNodeField } = actions;
	const inlineCodeAST = flatFilter(
		markdownAST,
		node => node.type === "inlineCode"
	);
	let inlineWords = 0;
	if (inlineCodeAST && inlineCodeAST.children) {
		inlineWords = inlineCodeAST.children.reduce(
			(numberOfInline, inlineCodeNode) => {
				const { value } = inlineCodeNode;
				const words = value.split(/\b/g);
				return numberOfInline + words.length;
			},
			0
		);
	}

	createNodeField({
		name: `inlineCount`,
		node: markdownNode,
		value: inlineWords
	});
};

module.exports = addInlineCount;
