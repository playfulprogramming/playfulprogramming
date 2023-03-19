import { Root } from "hast";
import { Plugin } from "unified";

import { h } from "hastscript";
import { visit } from "unist-util-visit";

import path from "path";

/**
 * They need to be the same `getImage` with the same `globalThis` instance, thanks to the "hack" workaround.
 */
import { getPicture } from "./get-picture-hack";
import { getImageSize } from "../get-image-size";
import { fileURLToPath } from "url";
import { getFullRelativePath } from "../url-paths";
import { getLargestSourceSetSrc } from "../get-largest-source-set-src";

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

				let src: string;
				if (node.properties.src.startsWith("/")) {
					src = node.properties.src;
				} else {
					src = getFullRelativePath(
						`/content/${parentFolder}/${slug}/`,
						node.properties.src
					);
				}

				if (src.endsWith(".svg") || src.endsWith(".gif")) {
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
					alt: node.properties.alt || "",
				});

				const pngSource = pictureResult.sources.reduce((prev, source) => {
					const largestSrc = getLargestSourceSetSrc(source.srcset);
					// select first option
					if (!prev) return largestSrc;
					// SVG first
					if (prev.src.endsWith(".svg")) return prev;
					if (largestSrc.src.endsWith(".svg")) return prev;
					// Prefer `w`
					if (prev.sizeType === "w" && largestSrc.sizeType === "x") return prev;
					if (largestSrc.sizeType === "w" && prev.sizeType === "x")
						return largestSrc;
					// Get the bigger of the two
					if (largestSrc.size > prev.size) return largestSrc;
					// Prefer PNG and JPG
					if (largestSrc.size === prev.size) {
						if (
							prev.src.endsWith(".webp") &&
							(largestSrc.src.endsWith(".png") ||
								largestSrc.src.endsWith(".jpg") ||
								largestSrc.src.endsWith(".jpeg"))
						)
							return largestSrc;
					}
					return prev;
				}, null as ReturnType<typeof getLargestSourceSetSrc>);

				const sources = pictureResult.sources.map((attrs) => {
					return h("source", attrs);
				});

				Object.assign(
					node,
					h("picture", {}, [
						...sources,
						h("img", {
							alt: node.properties.alt,
							loading: "lazy",
							decoding: "async",
							"data-zoom-src": pngSource.src,
							style: `width: ${pngSource.size}px`,
						}),
					])
				);
			})
		);
	};
};
