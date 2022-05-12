jest.mock("next/image", () => {
  const React = require("react");

  return function NextImage(props: any) {
    const { priority, ...rest } = props;
    return <img {...rest}>{props.children}</img>;
  };
});

export default {};
