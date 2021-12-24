import * as React from "react";
import { useMarkdownRendererProps } from "./types";
import Zoom from "react-medium-image-zoom";
import { getFullRelativePath } from "utils/url-paths";
import path from "path";

/**
 * If this is not here, what will happen is that it will try to import markdown
 * files in `content/blog
 *
 * @see https://github.com/cyrilwanner/next-optimized-images/issues/16#issuecomment-405556547
 * @see https://webpack.js.org/guides/dependency-management/#requirecontext
 * @see https://github.com/Jam3/nextjs-boilerplate
 */
const requireWebpImage = require.context(
  "../../../../content",
  true,
  /\.(?:png|jpg|jpeg)$/
);

export const getMedia = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    img: (imgProps: HTMLImageElement) => {
      const { src, height, width, ...props2 } = imgProps;
      console.log({
        serverPath: serverPath[0],
        src,
        val: getFullRelativePath(src),
      });

      const realSrc = requireWebpImage(
        `./${getFullRelativePath(...serverPath, src)}`
      );
      
      const htmlProps = imgProps as Record<string, any>;
      const noZoomProp = htmlProps["data-nozoom"] ?? htmlProps?.dataset?.nozoom;
      const shouldZoom = noZoomProp ? noZoomProp === "false" : true;

      const ZoomComp = shouldZoom
        ? Zoom
        : ((({ children }) => <>{children}</>) as React.FC);

      return (
        <ZoomComp>
          <img {...(props2 as any)} src={realSrc} />
        </ZoomComp>
      );
    },
    video: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => {
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
  };
};
