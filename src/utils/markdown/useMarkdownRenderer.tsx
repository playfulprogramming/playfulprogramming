import * as React from "react";
import { unified } from "unified";
// import reactRehyped from "rehype-react";
import { ReactElement, ReactNode } from "react";
import {
  getHeadings,
  getMedia,
  getLinks,
  getTable,
} from "./MarkdownRenderer";
import { useMarkdownRendererProps } from "./MarkdownRenderer/types";
// import { ComponentsWithNodeOptions } from "rehype-react/lib/complex-types";

import rehypeParse from "rehype-parse";

// type ComponentMap = ComponentsWithNodeOptions["components"];
type ComponentMap = any;

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
  return unified()
    .use(rehypeParse)
    // TODO: Create `rehypeAstro` plugin
    // .use(reactRehyped, {
    //   createElement: React.createElement,
    //   components: getComponents(props, comps) as any,
    // })
    .processSync(props.markdownHTML).result as ReactElement
};
