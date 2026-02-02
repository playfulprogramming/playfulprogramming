import { siteUrl } from "constants/site-config";

const parent = new URL(siteUrl).hostname;

// Twitch doesn't give us much without auth, so for now we're just getting the page metadata
export async function getTwitchVideoDataFromUrl(url: string) {
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

export const twitchHosts = ["clips.twitch.tv", "twitch.tv"];
