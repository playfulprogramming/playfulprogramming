import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { Node, Element } from "hast";
import { visit } from "unist-util-visit";
import rehypeStringify from "rehype-stringify";
import { json } from "zod/v4";

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

export const oembedVideoHosts = [...vimeoHosts, ...youtubeHosts];

// Can't access Vimeo oEmbed directly due to JS Turnstile protection blocking any info about the video
export async function getVimeoOEmbedDataFromUrl<T>(
	url: string,
): Promise<T | null> {
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

export async function getOEmbedDataFromUrl<T>(url: string): Promise<T | null> {
	const _url = new URL(url);
	if (vimeoHosts.includes(_url.hostname)) {
		return getVimeoOEmbedDataFromUrl(url);
	}

	return getGenericOEmbedDataFromUrl(url);
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
