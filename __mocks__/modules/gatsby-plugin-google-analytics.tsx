import { onLinkClick } from "gatsby-plugin-google-analytics";

afterEach(() => {
	onLinkClick.mockReset();
});

jest.mock("gatsby-plugin-google-analytics", () => {
	const React = require("react");
	const onLinkClickFn = jest.fn();

	return {
		OutboundLink: (props: any) => (
			<div onClick={onLinkClickFn}>{props.children}</div>
		),
		onLinkClick: onLinkClickFn
	};
});

export default {};
