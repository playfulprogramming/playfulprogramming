import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { Node, Element } from "hast";
import { visit } from "unist-util-visit";
import rehypeStringify from "rehype-stringify";
import { json } from "zod/v4";
import { siteUrl } from "constants/site-config";

function createHTMLVisitor(visitor: (tree: Node) => void) {
	return unified()
		.use(rehypeParse, { fragment: true } as never)
		.use(() => (tree) => {
			visitor(tree);
		})
		.use(rehypeStringify);
}

const vimeoHosts = ["vimeo.com"];

const youtubeHosts = ["youtube.com", "www.youtube.com"];

const oembedVideoHosts = [...vimeoHosts, ...youtubeHosts];

const twitchHosts = ["clips.twitch.tv", "twitch.tv"];

export const videoHosts = [...oembedVideoHosts, ...twitchHosts];

const parent = new URL(siteUrl).hostname;

// Twitch doesn't give us much without auth, so for now we're just getting the page metadata
async function getTwitchVideoDataFromUrl(url: string) {
	// Fix issues with Twitch's iframe embed
	const srcUrl = new URL(url);
	let embedUrl: URL | undefined;

	if (srcUrl.host === "clips.twitch.tv") {
		const clipId =
			srcUrl.searchParams.get("clip") || srcUrl.pathname.substring(1);
		embedUrl = new URL(`https://clips.twitch.tv/embed`);
		embedUrl.searchParams.set("clip", clipId);
	}

	// TODO: add support for twitch "video" and "collection" URLs
	// https://dev.twitch.tv/docs/embed/everything/#usage
	// https://github.com/MichaelDeBoey/gatsby-remark-embedder/blob/e80bce7d3adfc19f4ab5fc9cead9da9f60cedb55/src/transformers/Twitch.js

	if (!embedUrl) {
		embedUrl = srcUrl;
	}

	// Set the "parent" property for embedding - https://dev.twitch.tv/docs/embed/everything/#usage
	embedUrl.searchParams.set("parent", parent);

	// Needs data-frame-title as it will otherwise show "Twitch Error" on Vercel
	return {
		html: `<iframe src="${embedUrl.toString()}" data-frame-title="Twitch Embed" height="300" scrolling="no" allowfullscreen></iframe>`,
		// For consistency
		title: null,
		thumbnail_url: null,
	};
}

interface VimeoOEmbedResponse {
	type: "video";
	version: "1.0";
	provider_name: "Vimeo";
	provider_url: "https:\/\/vimeo.com\/";
	title: string;
	author_name: string;
	author_url: string;
	is_plus: string;
	account_type: string;
	html: string;
	width: number;
	height: number;
	duration: number;
	description: string;
	thumbnail_url: string;
	thumbnail_width: number;
	thumbnail_height: number;
	thumbnail_url_with_play_button: string;
	upload_date: string;
	video_id: number;
	uri: string;
}

// Can't access Vimeo oEmbed directly due to JS Turnstile protection blocking any info about the video
export async function getVimeoOEmbedDataFromUrl(
	url: string,
): Promise<VimeoOEmbedResponse | null> {
	return await fetch(
		`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
	)
		.then((res) => (res.ok ? res : Promise.reject(res)))
		.then((res) => res.json())
		.then((res) => ({
			...res,
			thumbnail_url: decodeURIComponent(res.thumbnail_url),
		}));
}

export async function getGenericOEmbedDataFromUrl<T>(
	url: string,
): Promise<T | null> {
	// HTML
	const pageData = await fetch(url)
		.then((res) => (res.ok ? res : Promise.reject(res)))
		.then((res) => res.text());

	if (!pageData) return null;

	let linkToJSON: string | null = null;

	const visitor = createHTMLVisitor((tree) => {
		visit(tree, { tagName: "link" }, (_node) => {
			const node: Element = _node;
			if (
				node.properties &&
				node.properties.type &&
				// TODO: Handle "text/xml+oembed"
				// TODO: Handle Link headers
				node.properties.type === "application/json+oembed"
			) {
				linkToJSON = node.properties.href as string;
			}
		});
	});

	visitor.processSync(pageData);

	if (!linkToJSON) return null;

	return await fetch(linkToJSON)
		.then((res) => (res.ok ? res : Promise.reject(res)))
		.then((res) => res.json());
}

interface YouTubeOEmbedResponse {
	title: string;
	author_name: string;
	author_url: string;
	type: "video";
	height: number;
	width: number;
	version: "1.0";
	provider_name: "YouTube";
	provider_url: "https://www.youtube.com/";
	thumbnail_height: number;
	thumbnail_width: number;
	thumbnail_url: string;
	html: string;
}

export async function getVideoDataFromUrl(
	url: string,
): Promise<
	| YouTubeOEmbedResponse
	| VimeoOEmbedResponse
	| ReturnType<typeof getTwitchVideoDataFromUrl>
	| null
> {
	const _url = new URL(url);
	if (vimeoHosts.includes(_url.hostname)) {
		return getVimeoOEmbedDataFromUrl(url);
	}

	if (twitchHosts.includes(_url.hostname)) {
		return getTwitchVideoDataFromUrl(url);
	}

	return getGenericOEmbedDataFromUrl<YouTubeOEmbedResponse>(url);
}

export async function getIFrameAttributes(html: string) {
	let properties = {} as Record<string, unknown>;
	const visitor = createHTMLVisitor((tree) => {
		visit(tree, { tagName: "iframe" }, (_node) => {
			if (!_node) return;
			const node: Element = _node;
			properties = node.properties;
		});
	});

	visitor.processSync(html);
	return properties;
}
