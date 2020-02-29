import { onLinkClick } from "gatsby";
const React = require("react");

afterEach(() => {
	onLinkClick.mockReset();
});

jest.mock("gatsby", () => {
	const react = require("react");
	const gatsbyOGl = jest.requireActual("gatsby");
	const onLinkClick = jest.fn();

	return {
		...gatsbyOGl,
		Link: react.forwardRef((props: any, ref: any) => {
			const {
				// these props are invalid for an `a` tag
				activeClassName,
				activeStyle,
				getProps,
				innerRef,
				partiallyActive,
				replace,
				to,
				...rest
			} = props;
			return (
				<a
					{...rest}
					onClick={onLinkClick}
					style={props.style}
					className={props.className}
					ref={ref}
					href={to}
				>
					{props.children}
				</a>
			);
		}),
		onLinkClick,
		graphql: jest.fn(),
		StaticQuery: jest.fn(),
		useStaticQuery: jest.fn()
	};
});
