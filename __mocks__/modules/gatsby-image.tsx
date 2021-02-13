jest.mock("gatsby-image", () => {
	const React = require("react");

	return (props: any) => {
		return (
			<img
				src={props.fixed}
				alt={props.alt}
				data-testid={props["data-testid"]}
				className={props.className}
			/>
		);
	};
});

export default {};
