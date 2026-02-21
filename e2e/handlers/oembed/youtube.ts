import { http, HttpResponse, HttpResponseResolver } from "msw";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const YOUTUBE_VIDEO_URL = `https://noembed.com/embed?dataType=json&url=${encodeURIComponent("https://www.youtube.com/watch?v=_licnRxAVk0")}`;
const YOUTUBE_SHORT_URL = `https://noembed.com/embed?dataType=json&url=${encodeURIComponent("https://www.youtube.com/watch?v=Fdbha07mFzo")}`;

const thumbnailPath = createRequire(import.meta.url).resolve(
	"./youtube_thumbnail.jpg",
);
const thumbnailBase64 = await readFile(thumbnailPath, "base64");
const thumbnailBase64Url = `data:image/jpeg;base64,${thumbnailBase64}`;

const oembedJson = {
	title: "React vs Vue vs Angular with Corbin Crutchley",
	author_name: "Syntax",
	author_url: "https://www.youtube.com/@syntaxfm",
	type: "video",
	height: 113,
	width: 200,
	version: "1.0",
	provider_name: "YouTube",
	provider_url: "https://www.youtube.com/",
	thumbnail_height: 360,
	thumbnail_width: 480,
	thumbnail_url: thumbnailBase64Url,
	html: "\u003ciframe width=\u0022200\u0022 height=\u0022113\u0022 src=\u0022https://www.youtube.com/embed/_licnRxAVk0?feature=oembed\u0022 frameborder=\u00220\u0022 allow=\u0022accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\u0022 referrerpolicy=\u0022strict-origin-when-cross-origin\u0022 allowfullscreen title=\u0022React vs Vue vs Angular with Corbin Crutchley\u0022\u003e\u003c/iframe\u003e",
};

const oembedJsonResolver: HttpResponseResolver = () => {
	return HttpResponse.json(oembedJson);
};

export const youtubeHandlers = [
	http.get(YOUTUBE_VIDEO_URL, oembedJsonResolver),
	http.get(YOUTUBE_SHORT_URL, oembedJsonResolver),
];
