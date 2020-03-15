// I would rather have these in their respective plugins folders, but Gatsby
// didn't like having MarkdownRemarkFields implemented twice
exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions;
	const typeDefs = `
    type MarkdownRemarkFields implements Node {
      inlineCount: Int
			headingsWithId: [HeadingsWithId]
    }
    type HeadingsWithId {
      value: String!
      depth: Int!
      slug: String!
    }
  `;
	createTypes(typeDefs);
};
