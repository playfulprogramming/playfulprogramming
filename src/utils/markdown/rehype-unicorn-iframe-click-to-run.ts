import { Root } from "hast";
import { Plugin } from "unified";

import { visit } from "unist-util-visit";

import { EMBED_SIZE } from "./constants";
import { h } from "hastscript";
import { fromHtml } from "hast-util-from-html";
import find from "unist-util-find";
import { getLargestManifestIcon, Manifest } from "../get-largest-manifest-icon";

/**
 * They need to be the same `getImage` with the same `globalThis` instance, thanks to the "hack" workaround.
 */
import { getPicture } from "../../../node_modules/@astrojs/image";
import sharp_service from "../../../node_modules/@astrojs/image/dist/loaders/sharp.js";
import type { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";
// This does not download the whole file to get the file size
import probe from "probe-image-size";

interface RehypeUnicornIFrameClickToRunProps {}

const ManifestIconMap = new Map<
	string,
	{ result: GetPictureResult; height: number; width: number }
>();

// TODO: Add switch/case and dedicated files ala "Components"
export const rehypeUnicornIFrameClickToRun: Plugin<
	[RehypeUnicornIFrameClickToRunProps | never],
	Root
> = () => {
	// HACK: This is a hack that heavily relies on `getImage`'s internals :(
	globalThis.astroImage = {
		...(globalThis.astroImage || {}),
		loader: sharp_service ?? globalThis.astroImage?.loader,
	};

	return async (tree, file) => {
		const iframeNodes: any[] = [];
		visit(tree, (node: any) => {
			if (node.tagName === "iframe") {
				iframeNodes.push(node);
			}
		});

		await Promise.all(
			iframeNodes.map(async (iframeNode) => {
				const width = iframeNode.properties.width ?? EMBED_SIZE.w;
				const height = iframeNode.properties.height ?? EMBED_SIZE.h;
				const req = await fetch(iframeNode.properties.src);
				let pageTitleString: string | undefined;
				let iconLink: string | undefined;
				let iframePicture:
					| ReturnType<typeof ManifestIconMap["get"]>
					| undefined;
				const iframeOrigin = new URL(iframeNode.properties.src).origin;
				if (req.status === 200) {
					const srcHTML = await req.text();
					const srcHast = fromHtml(srcHTML);
					const titleEl = find(srcHast, { tagName: "title" });

					pageTitleString = titleEl.children[0].value;

					if (ManifestIconMap.has(iframeOrigin)) {
						iframePicture = ManifestIconMap.get(iframeOrigin);
					} else {
						// <link rel="manifest" href="/manifest.json">
						const manifestPath = find(
							srcHast,
							(node) => node?.properties?.rel?.[0] === "manifest"
						);

						if (manifestPath) {
							// `/manifest.json`
							const manifestRelativeURL = manifestPath.properties.href;
							const fullManifestURL = new URL(
								manifestRelativeURL,
								iframeNode.properties.src
							).href;
							const manifestReq = await fetch(fullManifestURL);
							if (manifestReq.status === 200) {
								const manifestContents = await manifestReq.text();
								const manifestJSON: Manifest = JSON.parse(manifestContents);
								const largestIcon = getLargestManifestIcon(manifestJSON);
								iconLink = new URL(largestIcon.icon.src, iframeOrigin).href;
							}
						} else {
							// fetch `favicon.ico`
							// <link rel="icon" type="image/png" href="https://example.com/img.png">
							const favicon = find(
								srcHast,
								(node) => node?.properties?.rel?.[0] === "icon"
							);
							if (favicon) {
								iconLink = new URL(favicon.properties.href, iframeOrigin).href;
							}
						}
					}
				}

				if (iconLink) {
					try {
						const { height: imgHeight, width: imgWidth } = await probe(
							iconLink
						);
						const aspectRatio = imgHeight / imgWidth;
						const result = await getPicture({
							src: iconLink,
							widths: [50],
							formats: ["webp", "png"],
							aspectRatio: aspectRatio,
						});

						iframePicture = { result, height: imgHeight, width: imgWidth };

						ManifestIconMap.set(iframeOrigin, iframePicture);
						// eslint-disable-next-line no-empty
					} catch (_e) {}
				}

				// TODO: Add placeholder image
				const sources =
					iframePicture &&
					iframePicture.result.sources.map((attrs) => {
						return h("source", attrs);
					});

				const iframeReplacement = h(
					"div",
					{
						class: "iframe-replacement-container",
						"data-iframeurl": iframeNode.properties.src,
						"data-pagetitle": pageTitleString,
						"data-pageicon": iframePicture
							? JSON.stringify(iframePicture)
							: undefined,
						"data-width": width,
						"data-height": height,
						style: `height: ${height}px; width: ${width}px;`,
					},
					[
						iframePicture
							? h("picture", [
									...sources,
									h("img", {
										...(iframePicture.result.image as never as object),
										class: "iframe-replacement-icon",
										alt: "",
										loading: "lazy",
										decoding: "async",
									}),
							  ])
							: null,
						h("p", { class: "iframe-replacement-title" }, [
							h("span", { class: "visually-hidden" }, ["An embedded webpage:"]),
							pageTitleString,
						]),
						h("button", { class: "baseBtn iframe-replacement-button" }, [
							"Run embed",
						]),
					]
				);
				Object.assign(iframeNode, iframeReplacement);
			})
		);
	};
};
