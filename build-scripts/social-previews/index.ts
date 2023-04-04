import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { promises as fsPromises } from "fs";
import { resolve } from "path";
import { getAllPosts } from "utils/get-all-posts";
import { PostInfo } from "types/index";
import {
	layouts,
	heightWidth,
	renderPostPreviewToString,
} from "./shared-post-preview-png";
import { Layout } from "./base";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

const createPostSocialPreviewPng = async (layout: Layout, post: PostInfo) => {
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

	await page.setContent(await renderPostPreviewToString(layout, post));
	return (await page.screenshot()) as Buffer;
};

const build = async () => {
	const posts = getAllPosts("en");

	// Relative to root
	const outDir = resolve(process.cwd(), "./public/generated");
	await fsPromises.mkdir(outDir, { recursive: true });

	/**
	 * This is done synchronously, in order to prevent more than a single instance
	 * of the browser from running at the same time.
	 */
	for (const post of posts) {
		for (const layout of layouts) {
			const png = await createPostSocialPreviewPng(layout, post);

			await fsPromises.writeFile(
				resolve(outDir, `${post.slug}.${layout.name}.png`),
				png
			);
		}
	}

	await browser.close();
};

// For non-prod builds, this isn't needed
if (!process.env.BUILD_ENV || process.env.BUILD_ENV !== "dev") build();
