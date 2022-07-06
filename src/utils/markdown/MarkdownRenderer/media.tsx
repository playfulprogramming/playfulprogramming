import React from 'react';
import { useMarkdownRendererProps } from "./types";
// import Image, { ImageProps } from "next/image";
// import Zoom from "react-medium-image-zoom";
import { getFullRelativePath } from "utils/url-paths";
import { EMBED_SIZE } from "../constants";

export const getMedia = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    video: (
      props: any
    ) => {
      const { src, ...rest } = props;
      const srcStr = getFullRelativePath(...serverPath, src || "");
      return (
        <video
          muted={true}
          autoPlay={true}
          controls={true}
          loop={true}
          width="100%"
          height="auto"
          {...rest}
          src={srcStr}
        />
      );
    },
    iframe: (
      props: any
    ) => {
      const { src, ...rest } = props;
      return (
        <iframe
          width={EMBED_SIZE.w}
          height={EMBED_SIZE.h}
          loading="lazy"
          {...rest}
          src={src}
        />
      );
    },
  };
};
