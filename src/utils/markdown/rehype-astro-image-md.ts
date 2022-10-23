import { Root } from "hast";
import { Plugin } from "unified";

import { h } from "hastscript";
import { visit } from "unist-util-visit";

import path from "path";

/**
 * They need to be the same `getImage` with the same `globalThis` instance, thanks to the "hack" workaround.
 */
import { getPicture } from "../../../node_modules/@astrojs/image";
import sharp_service from "../../../node_modules/@astrojs/image/dist/loaders/sharp.js";
import { getImageSize } from "../get-image-size";
import { fileURLToPath } from "url";
import { getFullRelativePath } from "../url-paths";

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
			...(globalThis.astroImage || {}),
			loader: sharp_service ?? globalThis.astroImage?.loader,
			defaultLoader: sharp_service ?? globalThis.astroImage?.defaultLoader,
		};

		const imgNodes: any[] = [];
		visit(tree, (node: any) => {
			if (node.tagName === "img") {
				imgNodes.push(node);
			}
		});

		await Promise.all(
			imgNodes.map(async (node) => {
				const splitFilePath = path.dirname(file.path).split(path.sep);
				const slug = splitFilePath.at(-1);
				// "collections" | "blog"
				const parentFolder = splitFilePath.at(-2);

				const filePathDir = path.resolve(
					__dirname,
					`../../../public/content/${parentFolder}`,
					slug
				);

				const rootFileDir = path.resolve(__dirname, `../../../public/`);

				// TODO: How should remote images be handled?
				const dimensions = getImageSize(
					node.properties.src,
					filePathDir,
					rootFileDir
				) || {
					height: undefined,
					width: undefined,
				};

				// TODO: Remote images?
				if (!dimensions.height || !dimensions.width) return;

				const src = getFullRelativePath(
					`/content/${parentFolder}/${slug}/`,
					node.properties.src
				);

				if (src.endsWith(".svg")) {
					node.properties.src = src;
					return;
				}

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

				const pictureResult = await getPicture({
					src: src,
					widths: [dimensions.width],
					formats: ["webp", "png"],
					aspectRatio: imgRatioWidth,
				});

				const sources = pictureResult.sources.map((attrs) => {
					return h("source", attrs);
				});

				Object.assign(
					node,
					h("picture", [
						...sources,
						h("img", {
							alt: node.properties.alt,
							loading: "lazy",
							decoding: "async",
						}),
					])
				);
			})
		);
	};
};
