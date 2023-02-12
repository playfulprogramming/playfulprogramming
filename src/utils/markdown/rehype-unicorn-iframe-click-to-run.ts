import { Root } from "hast";
import { Plugin } from "unified";

import { visit } from "unist-util-visit";

import { EMBED_SIZE } from "./constants";
import { h } from "hastscript";
import { fromHtml } from "hast-util-from-html";
import find from "unist-util-find";
import { getLargestManifestIcon } from "../get-largest-manifest-icon";
import { getPicture } from "./get-picture-hack";
import type { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";
// This does not download the whole file to get the file size
import probe from "probe-image-size";

interface RehypeUnicornIFrameClickToRunProps {}

// default icon, used if a frame's favicon cannot be resolved
let defaultPageIcon: Promise<GetPictureResult>;
function fetchDefaultPageIcon(): Promise<GetPictureResult> {
	return (
		defaultPageIcon ||
		(defaultPageIcon = getPicture({
			src: "/link.png",
			widths: [50],
			formats: ["avif", "webp", "png"],
			aspectRatio: 1,
			alt: "",
		}))
	);
}

// Cache the fetch *promises* - so that only one request per manifest/icon is processed,
//   and multiple fetchPageInfo() calls can await the same icon
const pageIconMap = new Map<string, Promise<GetPictureResult>>();
function fetchPageIcon(src: URL, srcHast: Root): Promise<GetPictureResult> {
	if (pageIconMap.has(src.origin)) return pageIconMap.get(src.origin);

	const promise = (async () => {
		// <link rel="manifest" href="/manifest.json">
		const manifestPath = find(
			srcHast,
			(node) => node?.properties?.rel?.[0] === "manifest"
		);

		let iconLink: string;

		if (manifestPath) {
			// `/manifest.json`
			const manifestRelativeURL = manifestPath.properties.href;
			const fullManifestURL = new URL(manifestRelativeURL, src).href;

			const manifest = await fetch(fullManifestURL)
				.then((r) => r.status === 200 && r.json())
				.catch(() => null);

			if (manifest) {
				const largestIcon = getLargestManifestIcon(manifest);
				iconLink = new URL(largestIcon.icon.src, src.origin).href;
			}
		}

		if (!iconLink) {
			// fetch `favicon.ico`
			// <link rel="shortcut icon" type="image/png" href="https://example.com/img.png">
			const favicon = find(srcHast, (node) =>
				node?.properties?.rel?.includes("icon")
			);

			if (favicon) {
				iconLink = new URL(favicon.properties.href, src).href;
			}
		}

		// no icon image URL is found
		if (!iconLink) return null;
		const { height: imgHeight, width: imgWidth } = await probe(iconLink);
		const aspectRatio = imgHeight / imgWidth;
		return await getPicture({
			src: iconLink,
			widths: [50],
			formats: ["avif", "webp", "png"],
			aspectRatio: aspectRatio,
			alt: "",
		});
	})()
		// if an error is thrown, or response is null, use the default page icon
		.catch(() => null)
		.then((p) => p || fetchDefaultPageIcon());

	pageIconMap.set(src.origin, promise);
	return promise;
}

const pageHtmlMap = new Map<string, Promise<Root | null>>();
function fetchPageHtml(src: string): Promise<Root | null> {
	if (pageHtmlMap.has(src)) return pageHtmlMap.get(src);

	const promise = (async () => {
		const srcHTML = await fetch(src)
			.then((r) => r.status === 200 && r.text())
			.catch(() => null);

		// if fetch fails...
		if (!srcHTML) return null;

		const srcHast = fromHtml(srcHTML);

		return srcHast;
	})();

	pageHtmlMap.set(src, promise);
	return promise;
}

type PageInfo = {
	title?: string;
	icon: GetPictureResult;
};

async function fetchPageInfo(src: string): Promise<PageInfo | null> {
	// fetch origin url, catch any connection timeout errors
	const url = new URL(src);
	url.search = ""; // remove any search params

	const srcHast = await fetchPageHtml(url.toString());
	if (!srcHast) return null;

	// find <title> element in response HTML
	const titleEl = find(srcHast, { tagName: "title" });
	const title = titleEl ? titleEl.children[0].value : undefined;

	// find the page favicon (cache by page origin)
	const icon = await fetchPageIcon(url, srcHast);
	return { title, icon };
}

// TODO: Add switch/case and dedicated files ala "Components"
export const rehypeUnicornIFrameClickToRun: Plugin<
	[RehypeUnicornIFrameClickToRunProps | never],
	Root
> = () => {
	return async (tree) => {
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
				const info: PageInfo = (await fetchPageInfo(
					iframeNode.properties.src
				).catch(() => null)) || { icon: await fetchDefaultPageIcon() };

				const sources = info.icon.sources.map((attrs) => {
					return h("source", attrs);
				});

				const iframeReplacement = h(
					"div",
					{
						class: "iframe-replacement-container",
						"data-iframeurl": iframeNode.properties.src,
						"data-pagetitle": info.title,
						"data-pageicon": info.icon ? JSON.stringify(info.icon) : undefined,
						style: `height: ${
							Number(height) ? `${height}px` : height
						}; width: ${Number(width) ? `${width}px` : width};`,
					},
					[
						info.icon
							? h("picture", [
									...sources,
									h("img", {
										...(info.icon.image as object),
										class: "iframe-replacement-icon",
										alt: "",
										loading: "lazy",
										decoding: "async",
										"data-nozoom": "true",
									}),
							  ])
							: null,
						h("p", { class: "iframe-replacement-title" }, [
							h("span", { class: "visually-hidden" }, ["An embedded webpage:"]),
							info.title,
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
