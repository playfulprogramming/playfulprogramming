export interface VimeoOEmbedResponse {
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

export const vimeoHosts = ["vimeo.com"];

