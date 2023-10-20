import { parent } from "../../constants/site-config";

export const TwitchTransformer = {
	name: "Twitch",
	shouldTransform(url: string) {
		const { host } = new URL(url);
		return ["clips.twitch.tv", "player.twitch.tv"].includes(host);
	},
	getHTML(url: string) {
		const srcUrl = new URL(url);
		let embedUrl: URL | undefined = undefined;

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
		return `
			<iframe src="${embedUrl.toString()}" data-frame-title="Twitch Embed" height="300" scrolling="no" allowfullscreen></iframe>
		`;
	},
};
