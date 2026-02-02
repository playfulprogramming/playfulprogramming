export interface YouTubeOEmbedResponse {
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

export const youtubeHosts = ["youtube.com", "www.youtube.com"];
