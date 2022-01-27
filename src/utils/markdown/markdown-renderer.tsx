import * as React from "react";
import { ReactNode } from "react";
import { getHeadings, getMedia, getLinks } from "./markdown-renderer-comps";
import { SharedMarkdownRendererProps } from "./markdown-renderer-comps/types";
import { ComponentsWithNodeOptions } from "rehype-react/lib/complex-types";
import { MDXRemote } from "next-mdx-remote";

type ComponentMap = ComponentsWithNodeOptions["components"];

const getComponents = (
  props: SharedMarkdownRendererProps,
  comps: ComponentMap = {}
) => {
  return {
    // Temp fix to remove HTML, BODY, and HEAD nodes from render. Not sure why,
    // but it's being added to the markdown rendering in the `MarkdownRenderer`
    // step.
    html: ({ children }: { children: ReactNode[] }) => <>{children}</>,
    body: ({ children }: { children: ReactNode[] }) => <>{children}</>,
    head: ({ children }: { children: ReactNode[] }) => <>{children}</>,
    ...getHeadings(props),
    ...getMedia(props),
    ...getLinks(props),
    ...comps,
  };
};

export type Source = React.ComponentProps<typeof MDXRemote>;

interface MarkdownRendererProps {
  serverPath: string[];
  source: Source;
}

export const MarkdownRenderer = ({
  source,
  serverPath,
}: MarkdownRendererProps) => {
  const components = React.useMemo(() => {
    return getComponents({ serverPath }, {});
  }, []);

  return <MDXRemote {...source} components={components} />;
};
