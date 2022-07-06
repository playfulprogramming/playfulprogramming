import * as React from 'preact';
import { useMarkdownRendererProps } from "./types";
import { isRelativePath } from "../../url-paths";

export const getLinks = (_: useMarkdownRendererProps) => {
  return {
    a(
      props: any
    ) {
      const { href, ...restProps } = props;
      const isInternalLink = isRelativePath(href || "");
      if (!isInternalLink) {
        return (
          <a
            {...restProps}
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {props.children}
          </a>
        );
      }
      return (
        <a {...restProps} href={href || ""} >{props.children}</a>
      );
    },
  };
};
