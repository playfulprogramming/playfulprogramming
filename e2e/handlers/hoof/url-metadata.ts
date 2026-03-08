import type { UrlMetadataResponse } from "utils/hoof";
import env from "../../../src/constants/env";
import { http } from "msw";
import { createRequire } from "module";
import { readFile } from "fs/promises";

async function readImageToBase64(path: string) {
	const importPath = createRequire(import.meta.url).resolve(path);
	const data = await readFile(importPath, "base64");
	return `data:image/jpeg;base64,${data}`;
}

const fakeUrlMetadata: UrlMetadataResponse = {
	error: false,
	banner: {
		src: "/share-banner.png",
		width: 896,
		height: 448,
	},
	icon: {
		src: "/icons/icon-192x192.png",
		width: 192,
		height: 192,
	},
	title: "Mocked Url Metadata",
};

const fakeYoutubeVideoMetadata: UrlMetadataResponse = {
	error: false,
	title: "React vs Vue vs Angular with Corbin Crutchley",
	banner: {
		src: await readImageToBase64("./youtube_thumbnail.jpg"),
		height: 360,
		width: 480,
	},
	embed: {
		type: "video",
		src: "https://www.youtube.com/embed/_licnRxAVk0?feature=oembed",
		height: 113,
		width: 200,
	},
};

const fakeVimeoVideoMetadata: UrlMetadataResponse = {
	error: false,
	title: "React vs Vue vs Angular with Corbin Crutchley",
	banner: {
		src: await readImageToBase64("./vimeo_thumbnail.jpeg"),
		height: 227,
		width: 295,
	},
	embed: {
		type: "video",
		src: "https://player.vimeo.com/video/750377602?app_id=122963",
		height: 240,
		width: 312,
	},
};

const fakeTwitchVideoMetadata: UrlMetadataResponse = {
	error: false,
	embed: {
		type: "video",
		src: "https://clips.twitch.tv/TacitFitIcecreamTriHard-KgJCKYYIEPqxe4dQ",
	},
};

const fakePostMetadata: UrlMetadataResponse = {
	error: false,
	embed: {
		type: "post",
		post: {
			author: {
				name: "Playful Programming",
				handle: "playful_program",
			},
			content: "This is a tweet with no image",
			url: "https://x.com/playful_program/status/1917675879695552789",
			numLikes: 2,
			numReposts: 3,
			numReplies: 4,
			createdAt: "2023-01-28T12:00:00.000Z",
		},
	},
};

const fakePostWithImageMetadata: UrlMetadataResponse = {
	error: false,
	embed: {
		type: "post",
		post: {
			author: {
				name: "Playful Programming",
				handle: "playful_program",
			},
			content: "This is a tweet with one image",
			url: "https://x.com/playful_program/status/1917675879695552789",
			image: {
				src: await readImageToBase64("./x_thumbnail.jpg"),
				altText: "Alt text here",
				height: 747,
				width: 1329,
			},
			numLikes: 2,
			numReposts: 3,
			numReplies: 4,
			createdAt: "2023-01-28T12:00:00.000Z",
		},
	},
};

const fakePostNotFoundMetadata: UrlMetadataResponse = {
	error: false,
	embed: {
		type: "post",
	},
};

const fakeGistFileUrl = "https://example.test/url-metadata/gistfile1.txt";

const fakeGistMetadata: UrlMetadataResponse = {
	error: false,
	embed: {
		type: "gist",
		gist: {
			username: "crutchcorn",
			files: [
				{
					filename: "gistfile1.txt",
					contentUrl: fakeGistFileUrl,
					language: "text",
				},
			],
		},
	},
};

const urlMocks: Record<string, UrlMetadataResponse> = {
	"https://www.youtube.com/watch?v=_licnRxAVk0": fakeYoutubeVideoMetadata,
	"https://www.youtube.com/shorts/Fdbha07mFzo": fakeYoutubeVideoMetadata,
	"https://vimeo.com/750377602": fakeVimeoVideoMetadata,
	"https://clips.twitch.tv/TacitFitIcecreamTriHard-KgJCKYYIEPqxe4dQ":
		fakeTwitchVideoMetadata,
	"https://x.com/playful_program/status/1917675879695552789": fakePostMetadata,
	"https://x.com/playful_program/status/1917675872854614490":
		fakePostWithImageMetadata,
	"https://x.com/playful_program/status/123": fakePostNotFoundMetadata,
	"https://gist.github.com/crutchcorn/36fe5553219c05ea38bacf1c7396085b":
		fakeGistMetadata,
};

export const urlMetadataHandlers = [
	http.post<never, { url: string }>(
		`${env.HOOF_URL}/tasks/url-metadata`,
		async (req) => {
			const { url } = await req.request.json();
			const mock = urlMocks[url] ?? fakeUrlMetadata;

			return Response.json(mock, {
				headers: {
					"x-ratelimit-limit": "99999999",
					"x-ratelimit-remaining": "99999999",
					"x-ratelimit-reset": "0",
				},
			});
		},
	),
	http.get(fakeGistFileUrl, () => new Response("Hello World!")),
];
