const flatFilter = (ast, truthyFunc) => {
	if (!ast) return [];
	if (truthyFunc(ast)) return [ast];
	if (!ast.children) return [];
	let acceptedChildren = [];
	for (const child of ast.children) {
		const flatFilterResult = flatFilter(child, truthyFunc);
		if (flatFilterResult && flatFilterResult.length) {
			// Take array results and push to the returned array to flatten it
			flatFilterResult.forEach(flatFilterResultItem => {
				acceptedChildren.push(flatFilterResultItem);
			});
		}
	}
	return acceptedChildren;
};

const addVideo = ({ markdownAST, actions, markdownNode, ...props }) => {
	const { createNodeField } = actions;
	const inlineCodeAST = flatFilter(
		markdownAST,
		node => node.type === "inlineCode"
	);
	const inlineWords = inlineCodeAST.reduce((numberOfInline, inlineCodeNode) => {
		const { value } = inlineCodeNode;
		const words = value.split(/\b/g);
		return numberOfInline + words.length;
	}, 0);

	createNodeField({
		name: `inlineCount`,
		node: markdownNode,
		value: inlineWords
	});
};

module.exports = addVideo;
