import { TweetAPIResponse } from "utils/markdown/data-providers/fx-embed/types";

interface GetXPostDataProps {
	userId: string;
	postId: string;
}

export async function getXPostData({ userId, postId }: GetXPostDataProps) {
	const res = await fetch(
		`https://api.fxtwitter.com/${userId}/status/${postId}`,
		{
			// FXEmbed has asked us to add a user agent to be respectful
			headers: {
				"User-Agent": "PlayfulProgramming/1.0",
			},
		},
	);

	if (!res.ok) return null;

	const json = (await res.json()) as TweetAPIResponse;
	return json.tweet;
}

export const xHosts = ["twitter.com", "x.com"];
