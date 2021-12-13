jest.mock("disqus-react", () => {
	const React = require("react");
	return {
		DiscussionEmbed: () => <></>
	};
});

export default {};
