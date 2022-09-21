import { Root } from "hast";
import { Plugin } from "unified";

import { visit } from "unist-util-visit";

import path from "path";

/**
 * They need to be the same `getImage` with the same `globalThis` instance, thanks to the "hack" workaround.
 */
import { getImage } from "../../../node_modules/@astrojs/image";
import sharp_service from "../../../node_modules/@astrojs/image/dist/loaders/sharp.js";
import {getImageSize} from "../get-image-size";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface RehypeAstroImageProps {
  maxHeight?: number;
  maxWidth?: number;
}

export const rehypeAstroImageMd: Plugin<
  [RehypeAstroImageProps | never],
  Root
> = ({ maxHeight, maxWidth }) => {
  return async (tree, file) => {
    // HACK: This is a hack that heavily relies on `getImage`'s internals :(
    globalThis.astroImage = {
      loader: sharp_service ?? globalThis.astroImage?.loader,
    };

    let imgNodes: any[] = [];
    visit(tree, (node: any) => {
      if (node.tagName === "img") {
        imgNodes.push(node);
      }
    });

    await Promise.all(
      imgNodes.map(async (node) => {
        const slug = path.dirname(file.path).split('/').at(-1);

        const filePathDir = path.resolve(__dirname, '../../../public/content/blog', slug)

        // TODO: How should remote images be handled?
        const dimensions = getImageSize(node.properties.src, filePathDir) || {
          height: undefined,
          width: undefined,
        };

        // TODO: Remote images?
        if (!dimensions.height || !dimensions.width) return;

        const imgRatioHeight = dimensions.height / dimensions.width;
        const imgRatioWidth = dimensions.width / dimensions.height;
        if (maxHeight && dimensions.height > maxHeight) {
          dimensions.height = maxHeight;
          dimensions.width = maxHeight * imgRatioWidth;
        }

        if (maxWidth && dimensions.width > maxWidth) {
          dimensions.width = maxWidth;
          dimensions.height = maxWidth * imgRatioHeight;
        }

        const imgProps = await getImage({
          src: `/content/blog/${slug}/${node.properties.src}`,
          height: dimensions.height,
          width: dimensions.width,
        });

        node.properties.src = imgProps.src;
      })
    );
  };
};
