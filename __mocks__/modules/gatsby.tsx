import { onLinkClick } from "gatsby";

afterEach(() => {
	onLinkClick.mockReset();
});

jest.mock("gatsby", () => {
	const React = require("react");
	const gatsbyOGl = jest.requireActual("gatsby");
	const onLinkClickFn = jest.fn();

	return {
		...gatsbyOGl,
		Link: React.forwardRef((props: any, ref: any) => {
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
					onClick={onLinkClickFn}
					style={props.style}
					className={props.className}
					ref={ref}
					href={to}
				>
					{props.children}
				</a>
			);
		}),
		onLinkClick: onLinkClickFn,
		graphql: jest.fn(),
		StaticQuery: jest.fn(),
		useStaticQuery: jest.fn()
	};
});

export default {};
