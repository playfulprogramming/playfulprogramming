exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions;
	const typeDefs = `
    type MarkdownRemarkFields implements Node {
      inlineCount: Int
    }
  `;
	createTypes(typeDefs);
};
