import * as React from "react";
import { useMarkdownRendererProps } from "./types";
import Zoom from "react-medium-image-zoom";
import { getFullRelativePath, isRelativePath } from "utils/url-paths";
import path from "path";

/**
 * If this is not here, what will happen is that it will try to import markdown
 * files in `content/blog
 *
 * @see https://github.com/cyrilwanner/next-optimized-images/issues/16#issuecomment-405556547
 * @see https://webpack.js.org/guides/dependency-management/#requirecontext
 * @see https://github.com/Jam3/nextjs-boilerplate/blob/main/src/components/Image/Image.tsx
 */
const requireWebpImage = require.context(
  "../../../../public?{sizes:[320,640,960]}",
  true,
  /\.(?:png|jpg|jpeg)$/
);

export const getMedia = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    img: (imgProps: HTMLImageElement) => {
      const { src, height, width, ...props2 } = imgProps;

      let fullRelPath = getFullRelativePath(...serverPath, src);

      if (fullRelPath.startsWith("/")) {
        fullRelPath = fullRelPath.replace(/\//, "");
      }

      const realSrc =
        src.endsWith("svg") || !isRelativePath(src)
          ? // Don't optimize SVGs. This is because `svgo` turns them into
            // React components that seem to have issues with many of our examples
            { src: `/${fullRelPath}` }
          : requireWebpImage(`./${fullRelPath}`);

      const htmlProps = imgProps as Record<string, any>;
      const noZoomProp = htmlProps["data-nozoom"] ?? htmlProps?.dataset?.nozoom;
      const shouldZoom = noZoomProp ? noZoomProp === "false" : true;

      const ZoomComp = shouldZoom
        ? Zoom
        : ((({ children }) => <>{children}</>) as React.FC);

      return (
        <ZoomComp>
          {/* sizes is required for image zoom with srcSet */}
          <img
            {...(props2 as any)}
            src={realSrc.src}
            srcSet={realSrc.srcSet}
            sizes="(max-width: 640px) 100vw, 640px"
          />
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
