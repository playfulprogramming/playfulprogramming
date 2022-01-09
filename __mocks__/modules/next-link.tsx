export const mockOnLinkClick = jest.fn();

afterEach(() => {
  mockOnLinkClick.mockReset();
});

jest.mock("next/link", () => {
  const React = require("react");
  const { default: Link } = jest.requireActual("next/link");

  return function NextLink(props: any) {
    return (
      <Link
        {...props}
        onClick={(e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          mockOnLinkClick();
        }}
      >
        {props.children}
      </Link>
    );
  };
});

export default {};
