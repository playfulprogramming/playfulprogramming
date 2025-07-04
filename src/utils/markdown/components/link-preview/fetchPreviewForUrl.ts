import { URL } from "url";
import {
	fetchAsBrowser,
	fetchPageHtml,
	getOpenGraphImage,
} from "utils/fetch-page-html";
import * as path from "path";
import * as fs from "fs";
import * as stream from "stream";
import * as crypto from "crypto";
import { GetPictureOptions } from "utils/get-picture";
import { getImageSize } from "utils/get-image-size";
import {
	IMAGE_MAX_HEIGHT,
	IMAGE_MAX_WIDTH,
	IMAGE_SIZES,
} from "utils/markdown/constants";
import { PAGE_HEIGHT, PAGE_WIDTH } from "build-scripts/social-previews/base";

function getImagePath(url: URL) {
	const hash = crypto.createHash("md5").update(url.toString()).digest("hex");
	return `generated/${url.hostname}-${hash}.linkpreview`;
}

async function fetchPreviewForUrlInternal(
	url: URL,
): Promise<GetPictureOptions | undefined> {
	let result: GetPictureOptions | undefined;

	if (url.hostname === "playfulprogramming.com") {
		// If the url refers to another blog post, use its .twitter-preview image
		const path = /^\/posts\/([\w\-]+)/.exec(url.pathname);
		if (!path) return;

		const postSlug = path[1];
		if (!postSlug) return;

		result = {
			src: `https://playfulprogramming.com/generated/${postSlug}.twitter-preview.jpg`,
			width: PAGE_WIDTH,
			height: PAGE_HEIGHT,
		};
	} else {
		// Otherwise, try to parse an opengraph image from the link
		const html = await fetchPageHtml(url.toString());
		if (!html) return;
		let imageUrl: URL;
		try {
			imageUrl = new URL(getOpenGraphImage(html)!);
		} catch (e) {
			return;
		}

		const body = await fetchAsBrowser(imageUrl)
			.then((r) => r.body)
			.catch(() => null);
		if (!body) return;

		const imagePath = getImagePath(imageUrl);
		let imageExt = path.extname(imageUrl.pathname);

		const writeStream = fs.createWriteStream("public/" + imagePath + imageExt);
		await stream.promises
			.finished(stream.Readable.fromWeb(body as never).pipe(writeStream))
			.catch();
		// src is an absolute path, so the second getImageSize arg is never used
		const dimensions = await getImageSize(
			"/" + imagePath + imageExt,
			"",
		).catch();
		if (!dimensions) return;

		// If the image is missing an extension, replace it with the format from sharp metadata
		if (!imageExt) {
			imageExt = `.${dimensions.format}`;
			await fs.promises
				.rename("public/" + imagePath, "public/" + imagePath + imageExt)
				.catch();
		}

		const imageRatio = dimensions.width / dimensions.height;

		if (dimensions.height > IMAGE_MAX_HEIGHT) {
			dimensions.height = IMAGE_MAX_HEIGHT;
			dimensions.width = Math.floor(IMAGE_MAX_HEIGHT * imageRatio);
		}

		if (dimensions.width > IMAGE_MAX_WIDTH) {
			dimensions.width = IMAGE_MAX_WIDTH;
			dimensions.height = Math.floor(IMAGE_MAX_WIDTH / imageRatio);
		}

		result = {
			src: "/" + imagePath + imageExt,
			width: dimensions.width,
			height: dimensions.height,
			sizes: IMAGE_SIZES,
		};
	}

	return result;
}

// Store promises and ensure that only one promise per url runs at a time
// (this prevents race conditions when the same URL is requested in parallel, which otherwise throws a file error)
const promisesMap = new Map<URL, Promise<GetPictureOptions | undefined>>();

export function fetchPreviewForUrl(
	url: URL,
): Promise<GetPictureOptions | undefined> {
	const existingPromise = promisesMap.get(url);
	if (existingPromise != null) return existingPromise;
	const newPromise = fetchPreviewForUrlInternal(url);
	promisesMap.set(url, newPromise);
	return newPromise;
}
