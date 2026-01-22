import { http, HttpResponse, HttpResponseResolver } from "msw";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const thumbnailPath = createRequire(import.meta.url).resolve(
	"./vimeo_thumbnail.jpeg",
);
const thumbnailBase64 = await readFile(thumbnailPath, "base64");
const thumbnailBase64Url = `data:image/jpeg;base64,${thumbnailBase64}`;

const oembedJson = {
	type: "video",
	version: "1.0",
	provider_name: "Vimeo",
	provider_url: "https:\/\/vimeo.com\/",
	title: "Angular Language Service - Go to definition",
	author_name: "Enea Jahollari",
	author_url: "https:\/\/vimeo.com\/user169371163",
	is_plus: "0",
	account_type: "free",
	html: '<iframe src="https:\/\/player.vimeo.com\/video\/750377602?app_id=122963" width="312" height="240" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" title="Angular Language Service - Go to definition"><\/iframe>',
	width: 312,
	height: 240,
	duration: 52,
	description: "",
	thumbnail_url: thumbnailBase64Url,
	thumbnail_width: 295,
	thumbnail_height: 227,
	thumbnail_url_with_play_button: thumbnailBase64Url,
	upload_date: "2022-09-16 09:50:50",
	video_id: 750377602,
	uri: "\/videos\/750377602",
};

const oembedJsonResolver: HttpResponseResolver = () => {
	return HttpResponse.json(oembedJson);
};

export const vimeoHandlers = [
	http.get("https://vimeo.com/api/oembed.json", oembedJsonResolver),
];
