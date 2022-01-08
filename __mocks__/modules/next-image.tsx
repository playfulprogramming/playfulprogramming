jest.mock("next/image", () => {
  const React = require("react");

  return function NextImage(props: any) {
    return <img {...props}>{props.children}</img>;
  };
});

export default {};
