import * as React from "react";
import { Plugin, unified } from "unified";
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

import { isBrowser } from "utils/use-isomorphic-layout-effect";
import type { Options } from "rehype-parse/lib";
import type { Root } from "hast";

let rehypeParseIsomorphic: Plugin<[Options?] | Array<void>, string, Root>;

if (isBrowser()) {
  // @ts-ignore
  rehypeParseIsomorphic = (await import("rehype-dom-parse")).default;
} else {
  // @ts-ignore
  rehypeParseIsomorphic = (await import("rehype-parse")).default;
}

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
    // Temp fix to remove HTML, BODY, and HEAD nodes from render. Not sure why,
    // but it's being added to the markdown rendering in the `useMarkdownRenderer`
    // step.
    html: ({ children }: { children: ReactNode[] }) => <>{children}</>,
    body: ({ children }: { children: ReactNode[] }) => <>{children}</>,
    head: ({ children }: { children: ReactNode[] }) => <>{children}</>,
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
