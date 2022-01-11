import { useMarkdownRenderer } from "utils/markdown/useMarkdownRenderer";
import { useMarkdownRendererProps } from "utils/markdown/MarkdownRenderer/types";
import { fireEvent, render, screen } from "@testing-library/react";

const Comp = ({ props }: { props: useMarkdownRendererProps }) => {
  const result = useMarkdownRenderer(props);
  return <>{result}</>;
};

test("tabs should render", () => {
  render(
    <Comp
      props={{
        serverPath: [],
        markdownHTML: `
<tabs>
  <tab-list>
    <tab>Header</tab>
    <tab>Header2</tab>
  </tab-list>
  <tab-panel>Hello</tab-panel>
  <tab-panel>Goodbye</tab-panel>
</tabs>
    `,
      }}
    />
  );

  expect(screen.getByText("Header")).toBeInTheDocument();
  expect(screen.getByText("Hello")).toBeInTheDocument();
  expect(screen.queryByText("Goodbye")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Header2"));
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  expect(screen.getByText("Goodbye")).toBeInTheDocument();
});
