import { Root } from "hast";
import { Plugin } from "unified";

import { visit } from "unist-util-visit";

import { EMBED_SIZE } from "./constants";
import { h } from "hastscript";
import { fromHtml } from "hast-util-from-html";
import find from "unist-util-find";
import { getFullRelativePath } from "../url-paths";
import { getLargestManifestIcon, Manifest } from "../get-largest-manifest-icon";

interface RehypeUnicornIFrameClickToRunProps {}

// "https://example.com": "https://example.com/favicon.ico"
const ManifestIconMap = new Map<string, string>();

// TODO: Add switch/case and dedicated files ala "Components"
export const rehypeUnicornIFrameClickToRun: Plugin<
	[RehypeUnicornIFrameClickToRunProps | never],
	Root
> = () => {
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
				const iframeOrigin = new URL(iframeNode.properties.src).origin;
				if (req.status === 200) {
					const srcHTML = await req.text();
					const srcHast = fromHtml(srcHTML);
					const titleEl = find(srcHast, { tagName: "title" });

					pageTitleString = titleEl.children[0].value;

					if (ManifestIconMap.has(iframeOrigin)) {
						iconLink = ManifestIconMap.get(iframeOrigin);
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

				// TODO: `getPictures` on `iconLink` if present

				const iframeReplacement = h(
					"div",
					{
						class: "iframe-replacement-container",
						"data-iframeurl": iframeNode.properties.src,
						"data-pagetitle": pageTitleString,
						"data-pageicon": iconLink,
						"data-width": width,
						"data-height": height,
						style: `height: ${height}px; width: ${width}px;`,
					},
					[
						h("img", { src: iconLink }),
						h("p", { class: "iframe-replacement-title" }, [pageTitleString]),
						h("button", "Run embed"),
					]
				);
				Object.assign(iframeNode, iframeReplacement);
			})
		);
	};
};
