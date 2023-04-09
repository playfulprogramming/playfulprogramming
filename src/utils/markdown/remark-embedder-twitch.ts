import { parent } from "../../constants/site-config";

export const TwitchTransformer = {
	name: "Twitch",
	shouldTransform(url: string) {
		const { host } = new URL(url);
		return ["clips.twitch.tv", "player.twitch.tv"].includes(host);
	},
	getHTML(url: string) {
		const srcUrl = new URL(url);

		// Set the "parent" property for embedding - https://dev.twitch.tv/docs/embed/everything/#usage
		srcUrl.searchParams.set("parent", parent);

		return `
			<iframe src="${srcUrl.toString()}" height="300" scrolling="no" allowfullscreen></iframe>
		`;
	},
};
