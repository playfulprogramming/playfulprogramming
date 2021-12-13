export const onLinkClick = jest.fn();

afterEach(() => {
  onLinkClick.mockReset();
});

jest.mock("next/link", () => {
  const React = require("react");
  const { default: Link } = jest.requireActual("next/link");

  return function NextLink(props: any) {
    return (
      <Link
        {...props}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLinkClick();
        }}
      >
        {props.children}
      </Link>
    );
  };
});

export default {};
