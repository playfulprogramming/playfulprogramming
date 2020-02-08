const flatFilter = require("unist-util-flat-filter");

module.exports = ({ markdownAST, actions, markdownNode }) => {
	const { createNodeField } = actions;

	const values = flatFilter(markdownAST, node => node.type === "heading");

	const headings = values.children.map(node => {
		const last = node.children[node.children.length - 1];

		return {
			value: last.value,
			depth: node.depth,
			// This is added by the `gatsby-remark-autolink-headers` plugin, we're just using it here
			// This means that it must come after that plugin in your config file
			slug: node.data.id
		};
	});

	createNodeField({
		name: `headingsWithId`,
		node: markdownNode,
		value: headings
	});
	return markdownAST;
};
