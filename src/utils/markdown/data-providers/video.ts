import {
	getVimeoOEmbedDataFromUrl,
	vimeoHosts,
	VimeoOEmbedResponse,
} from "utils/markdown/data-providers/vimeo";
import {
	getYouTubeOEmbedDataFromUrl,
	youtubeHosts,
	YouTubeOEmbedResponse,
} from "utils/markdown/data-providers/youtube";
import {
	getTwitchVideoDataFromUrl,
	twitchHosts,
} from "utils/markdown/data-providers/twitch";
import { getGenericOEmbedDataFromUrl } from "utils/markdown/data-providers/oembed";

export async function getVideoDataFromUrl(
	url: string,
): Promise<
	| YouTubeOEmbedResponse
	| VimeoOEmbedResponse
	| ReturnType<typeof getTwitchVideoDataFromUrl>
	| null
> {
	const _url = new URL(url);

	if (youtubeHosts.includes(_url.hostname)) {
		return getYouTubeOEmbedDataFromUrl(url);
	}

	if (vimeoHosts.includes(_url.hostname)) {
		return getVimeoOEmbedDataFromUrl(url);
	}

	if (twitchHosts.includes(_url.hostname)) {
		return getTwitchVideoDataFromUrl(url);
	}

	return getGenericOEmbedDataFromUrl<YouTubeOEmbedResponse>(url);
}

const oembedVideoHosts = [...vimeoHosts, ...youtubeHosts];

export const videoHosts = [...oembedVideoHosts, ...twitchHosts];
