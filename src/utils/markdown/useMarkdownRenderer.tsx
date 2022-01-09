import * as React from "react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import reactRehyped from "rehype-react";
import { ReactElement, ReactNode } from "react";
import { getHeadings, getMedia, getLinks } from "./MarkdownRenderer";
import { useMarkdownRendererProps } from "./MarkdownRenderer/types";
import { ComponentsWithNodeOptions } from "rehype-react/lib/complex-types";

type ComponentMap = ComponentsWithNodeOptions["components"];

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
    tabs: ({ children }: { children: ReactNode[] }) => (
      <section>
        <h1>HELLO, SACRAMENTO</h1>
        {children}
      </section>
    ),
    tab: ({ children }: { children: ReactNode[] }) => (
      <div>
        <h2>Start tab</h2>
        {children}
      </div>
    ),
    ["tab-header"]: ({ children }: { children: ReactNode[] }) => (
      <div>
        <h3>Tab header</h3>
        {children}
      </div>
    ),
    ["tab-contents"]: ({ children }: { children: ReactNode[] }) => (
      <div>
        <h4>Tab contents</h4>
        {children}
      </div>
    ),
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
  return React.useMemo(
    () =>
      unified()
        .use(rehypeParse)
        .use(reactRehyped, {
          createElement: React.createElement,
          components: getComponents(props, comps) as any,
        })
        .processSync(props.markdownHTML).result as ReactElement,
    [comps, props]
  );
};
