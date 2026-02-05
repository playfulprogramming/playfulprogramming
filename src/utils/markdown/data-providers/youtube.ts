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

// Can't access YouTube oEmbed directly because YouTube aggressively ratelimits and fails fetching data on their
// webpages from a hosted domain, like GitHub actions or Fly.io
export async function getYouTubeOEmbedDataFromUrl(
	_url: string,
): Promise<YouTubeOEmbedResponse | null> {
	const url = new URL(_url);

	const splitPath = url.pathname.split("/").filter(Boolean);
	let videoId: string;
	if (splitPath[0] === "watch") {
		const explicitVideoId = url.searchParams.get("v");
		if (explicitVideoId) {
			// https://www.youtube.com/watch?v=Fdbha07mFzo
			videoId = explicitVideoId;
		} else {
			// https://www.youtube.com/watch/Fdbha07mFzo
			videoId = splitPath[1];
		}
		// https://www.youtube.com/shorts/Fdbha07mFzo
	} else if (splitPath[0] === "shorts") {
		videoId = splitPath[1];
	} else {
		return null;
	}

	const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

	return await fetch(
		`https://noembed.com/embed?dataType=json&url=${encodeURIComponent(youtubeUrl)}`,
	)
		.then((res) => (res.ok ? res : Promise.reject(res)))
		.then((res) => res.json());
}

export const youtubeHosts = ["youtube.com", "www.youtube.com"];
