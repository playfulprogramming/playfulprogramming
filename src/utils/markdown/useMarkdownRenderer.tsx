import * as React from "react";
import { unified } from "unified";
import reactRehyped from "rehype-react";
import { ReactElement, ReactNode } from "react";
import {
  getHeadings,
  getMedia,
  getLinks,
  getTabs,
  getTable,
} from "./MarkdownRenderer";
import { useMarkdownRendererProps } from "./MarkdownRenderer/types";
import { ComponentsWithNodeOptions } from "rehype-react/lib/complex-types";
import { MarkdownDataProvider } from "utils/markdown/MarkdownRenderer/data-context";

/**
 * This is replaced with the smaller `rehype-dom-parse` using Webpack
 * Bad idea? Sure, but trying the `isBrowser()` logic doesn't work for bundled stuff.
 *
 * Neither does the less obvious `if (isBrowser()) await import()`
 */
import rehypeParseIsomorphic from "rehype-parse";

type ComponentMap = ComponentsWithNodeOptions["components"];

const TabHeader: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <>{children}</>;
};

TabHeader.displayName = "TabHeader";

const getComponents = (
  props: useMarkdownRendererProps,
  comps: ComponentMap = {}
) => {
  return {
    ...getTable(props),
    ...getTabs(props),
    ...getHeadings(props),
    ...getMedia(props),
    ...getLinks(props),
    ...comps,
  };
};

export const useMarkdownRenderer = (
  props: useMarkdownRendererProps,
  comps: ComponentMap = {}
) => {
  // This only parses once to avoid serialization errors.
  // DO NOT ADD OTHER REHYPE PLUGINS OR REMARK PLUGINS HERE
  // This works in SRR just fine
  const result = React.useMemo(
    () =>
      unified()
        .use(rehypeParseIsomorphic)
        .use(reactRehyped, {
          createElement: React.createElement,
          components: getComponents(props, comps) as any,
        })
        .processSync(props.markdownHTML).result as ReactElement,
    [comps, props]
  );

  return <MarkdownDataProvider>{result}</MarkdownDataProvider>;
};
