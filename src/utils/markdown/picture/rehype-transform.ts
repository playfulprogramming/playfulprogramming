import { Root, Element } from "hast";
import { Plugin } from "unified";

import { h } from "hastscript";
import { visit } from "unist-util-visit";

import path from "path";

/**
 * They need to be the same `getImage` with the same `globalThis` instance, thanks to the "hack" workaround.
 */
import { getPicture } from "utils/get-picture";
import { getImageSize } from "../../get-image-size";
import { resolvePath } from "../../url-paths";
import { getLargestSourceSetSrc } from "../../get-largest-source-set-src";
import { Picture } from "./picture";

const MAX_WIDTH = 896;
const MAX_HEIGHT = 768;

/**
 * parse a height/width attribute value (e.g. "20px" or "20") and
 * return the value in pixel units, or undefined if it cannot be
 * parsed.
 */
function getPixelValue(attr: unknown): number | undefined {
	const [, pxValue] = /^([0-9]+)(px)?$/.exec(attr + "") || [];
	return typeof pxValue !== "undefined" ? Number(pxValue) : undefined;
}

export const rehypeAstroImageMd: Plugin<[], Root> = () => {
	return async (tree, file) => {
		const imgNodes: Element[] = [];
		visit(tree, "element", (node: Element) => {
			if (node.tagName === "img") {
				imgNodes.push(node);
			}
		});

		await Promise.all(
			imgNodes.map(async (node) => {
				const nodeSrc = node.properties.src as string;

				let src: string;

				const resolvedSrc = resolvePath(nodeSrc, path.dirname(file.path));
				if (resolvedSrc) {
					src = "/" + resolvedSrc.relativePath;
				} else {
					src = nodeSrc;
				}

				if (src.endsWith(".svg") || src.endsWith(".gif")) {
					node.properties.src = src;
					return;
				}

				// TODO: How should remote images be handled?
				const srcSize = getImageSize(nodeSrc, path.dirname(file.path)) || {
					height: undefined,
					width: undefined,
				};

				// TODO: Remote images?
				if (!srcSize.height || !srcSize.width) return;

				const imageRatio = srcSize.width / srcSize.height;

				const nodeWidth = getPixelValue(node.properties.width);
				const nodeHeight = getPixelValue(node.properties.height);

				const dimensions = { ...srcSize } as { width: number; height: number };
				if (nodeHeight) {
					dimensions.height = nodeHeight;
					dimensions.width = Math.floor(nodeHeight * imageRatio);
				} else if (nodeWidth) {
					dimensions.width = nodeWidth;
					dimensions.height = Math.floor(nodeWidth / imageRatio);
				}

				if (dimensions.height > MAX_HEIGHT) {
					dimensions.height = MAX_HEIGHT;
					dimensions.width = Math.floor(MAX_HEIGHT * imageRatio);
				}

				if (dimensions.width > MAX_WIDTH) {
					dimensions.width = MAX_WIDTH;
					dimensions.height = Math.floor(MAX_WIDTH / imageRatio);
				}

				const pictureResult = await getPicture({
					src: src,
					widths: [dimensions.width],
					formats: ["avif", "webp", "png"],
					aspectRatio: imageRatio,
				});

				let pngSource = {
					src: src,
					size: srcSize.width,
				};

				if (
					!(
						src.endsWith(".png") ||
						src.endsWith(".jpg") ||
						src.endsWith(".jpeg")
					)
				) {
					const originalPictureResult = await getPicture({
						src: src,
						widths: [srcSize.width],
						formats: ["png"],
						aspectRatio: imageRatio,
					});

					const newPngSource = originalPictureResult.sources.reduce(
						(prev, source) => {
							const largestSrc = getLargestSourceSetSrc(source.srcset);
							// select first option
							if (!prev) return largestSrc;
							// SVG first
							if (prev.src.endsWith(".svg")) return prev;
							if (largestSrc.src.endsWith(".svg")) return prev;
							// Prefer `w`
							if (prev.sizeType === "w" && largestSrc.sizeType === "x")
								return prev;
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
						},
						undefined as ReturnType<typeof getLargestSourceSetSrc> | undefined,
					);

					if (newPngSource) pngSource = newPngSource;
				}

				const {
					height: _height,
					width: _width,
					src: _src,
					alt: _alt,
					["data-zoom-src"]: _dataZoomSrc,
					...rest
				} = node.properties;

				Object.assign(
					node,
					Picture({
						result: pictureResult,
						alt: node.properties.alt?.toString(),
						zoomSrc: pngSource.src,
						imgAttrs: rest,
					}),
				);
			}),
		);
	};
};
