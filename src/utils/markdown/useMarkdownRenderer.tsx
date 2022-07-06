import {h, createElement, Fragment} from 'preact';
import { unified } from "unified";
import reactRehyped, {Options} from "rehype-react";
import {
  getHeadings,
  getMedia,
  getLinks,
  getTabs,
  getTable,
} from "./MarkdownRenderer";
import { useMarkdownRendererProps } from "./MarkdownRenderer/types";
import { ComponentsWithNodeOptions } from "rehype-react/lib/complex-types";

// TODO: Add this back
/**
 * This is replaced with the smaller `rehype-dom-parse` using Webpack
 * Bad idea? Sure, but trying the `isBrowser()` logic doesn't work for bundled stuff.
 *
 * Neither does the less obvious `if (isBrowser()) await import()`
 */
 import rehypeParseIsomorphic from "rehype-parse";

type ComponentMap = ComponentsWithNodeOptions["components"];

const getComponents = (
  props: useMarkdownRendererProps,
  comps: ComponentMap = {}
) => {
  return {
    // Temp fix to remove HTML, BODY, and HEAD nodes from render. Not sure why,
    // but it's being added to the markdown rendering in the `useMarkdownRenderer`
    // step.
    html: ({ children }: { children: JSX.Element[] }) => <>{children}</>,
    body: ({ children }: { children: JSX.Element[] }) => <>{children}</>,
    head: ({ children }: { children: JSX.Element[] }) => <>{children}</>,
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
  return unified()
    .use(rehypeParseIsomorphic)
    .use(reactRehyped, {
      createElement: createElement,
      components: getComponents(props, comps),
      Fragment: Fragment
    } as Options)
    .processSync(props.markdownHTML).result as JSX.Element
};
