import { http, HttpResponse, HttpResponseResolver } from "msw";
import { TweetAPIResponse } from "utils/markdown/data-providers/fx-embed/types";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const baseTweet = {
	created_at: "2023-01-28T12:00:00.000Z",
	created_timestamp: 1643366400,
	likes: 2,
	reposts: 3,
	replies: 4,
	media: {},
	author: {
		id: "playful_program",
		name: "Playful Programming",
		screen_name: "playful_program",
		avatar_url: null,
		banner_url: null,
		description: "",
		location: "Earth",
		url: "https://x.com/playful_program",
		protected: false,
		followers: 1000,
		following: 100,
		statuses: 2,
		media_count: 10,
		likes: 100,
		joined: "2022-01-28T12:00:00.000Z",
		website: null,
		birthday: {},
	},
	lang: null,
	possibly_sensitive: false,
	replying_to: null,
	source: null,
	is_note_tweet: false,
	community_note: null,
	embed_card: "tweet",
	provider: "twitter",
} satisfies Partial<TweetAPIResponse["tweet"]>;

const thumbnailPath = createRequire(import.meta.url).resolve(
	"./x_thumbnail.jpg",
);
const thumbnailBase64 = await readFile(thumbnailPath, "base64");
const thumbnailBase64Url = `data:image/jpeg;base64,${thumbnailBase64}`;

const jsonResolver: HttpResponseResolver<{
	userId: string;
	postId: string;
}> = ({ params }) => {
	if (params.postId === "1917675879695552789") {
		// Respond with no image but text
		return HttpResponse.json({
			code: 200,
			message: "Tweet found",
			tweet: {
				...baseTweet,
				id: "1917675879695552789",
				url: "https://x.com/playful_program/status/1917675879695552789",
				text: "This is a tweet with no image",
				raw_text: {
					text: "This is a tweet with no image",
					facets: [],
				},
			},
		} satisfies TweetAPIResponse);
	}

	if (params.postId === "1917675872854614490") {
		// Respond with a single image
		return HttpResponse.json({
			code: 200,
			message: "Tweet found",
			tweet: {
				...baseTweet,
				id: "1917675872854614490",
				url: "https://x.com/playful_program/status/1917675872854614490",
				text: "This is a tweet with no image",
				raw_text: {
					text: "This is a tweet with no image",
					facets: [],
				},
				media: {
					photos: [
						{
							type: "photo",
							altText: "Alt text here",
							height: 100,
							width: 100,
							url: thumbnailBase64Url,
						},
					],
				},
			},
		} satisfies TweetAPIResponse);
	}

	return HttpResponse.json({
		code: 404,
		message: "Tweet not found",
	} satisfies TweetAPIResponse);
};

export const xHandlers = [
	http.get("https://api.fxtwitter.com/:userId/status/:postId", jsonResolver),
];
