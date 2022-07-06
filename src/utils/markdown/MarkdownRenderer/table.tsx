import React from 'react';
import { useMarkdownRendererProps } from "./types";

export const getTable = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    table: (
      props: any
    ) => {
      return (
        <div className="table-container">
          <table {...props}>{props.children}</table>
        </div>
      );
    },
  };
};
