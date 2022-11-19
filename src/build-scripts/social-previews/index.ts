import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { promises as fsPromises } from "fs";
import { resolve } from "path";
import { getAllPosts } from "utils/get-all-posts";
import { PostInfo } from "types/index";
import {
	heightWidth,
	renderPostPreviewToString,
} from "./shared-post-preview-png";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

const createPostSocialPreviewPng = async (post: PostInfo) => {
	if (!browser) {
		browser = await chromium.puppeteer.launch({
			args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: true,
			ignoreHTTPSErrors: true,
		});
		page = await browser.newPage();
		await page.setViewport(heightWidth);
	}

	await page.setContent(await renderPostPreviewToString(post));
	return (await page.screenshot()) as Buffer;
};

// For non-prod builds, this isn't needed
if (!process.env.BUILD_ENV || process.env.BUILD_ENV === "production") {
	const posts = getAllPosts("en");

	/**
	 * This is done synchronously, in order to prevent more than a single instance
	 * of the browser from running at the same time.
	 */
	for (const post of posts) {
		const png = await createPostSocialPreviewPng(post);

		await fsPromises.writeFile(
			// Relative to root
			resolve(process.cwd(), `./public/${post.slug}.twitter-preview.png`),
			png
		);
	}

	await browser.close();
}
