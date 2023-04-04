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

const browser_args = [
	"--autoplay-policy=user-gesture-required",
	"--disable-background-networking",
	"--disable-background-timer-throttling",
	"--disable-backgrounding-occluded-windows",
	"--disable-breakpad",
	"--disable-client-side-phishing-detection",
	"--disable-component-update",
	"--disable-default-apps",
	"--disable-dev-shm-usage",
	"--disable-domain-reliability",
	"--disable-extensions",
	"--disable-features=AudioServiceOutOfProcess",
	"--disable-hang-monitor",
	"--disable-ipc-flooding-protection",
	"--disable-notifications",
	"--disable-offer-store-unmasked-wallet-cards",
	"--disable-popup-blocking",
	"--disable-print-preview",
	"--disable-prompt-on-repost",
	"--disable-renderer-backgrounding",
	"--disable-setuid-sandbox",
	"--disable-speech-api",
	"--disable-sync",
	"--hide-scrollbars",
	"--ignore-gpu-blacklist",
	"--metrics-recording-only",
	"--mute-audio",
	"--no-default-browser-check",
	"--no-first-run",
	"--no-pings",
	"--no-sandbox",
	"--no-zygote",
	"--password-store=basic",
	"--use-gl=swiftshader",
	"--use-mock-keychain",
	"--disable-web-security",
];

const createPostSocialPreviewPng = async (layout: Layout, post: PostInfo) => {
	if (!browser) {
		browser = await chromium.puppeteer.launch({
			args: [...chromium.args, ...browser_args],
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: true,
			ignoreHTTPSErrors: true,
			userDataDir: "./.puppeteer",
		});
		page = await browser.newPage();
		await page.setViewport(heightWidth);
	}

	await page.setContent(await renderPostPreviewToString(layout, post));
	return (await page.screenshot({ type: "jpeg" })) as Buffer;
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
				resolve(outDir, `${post.slug}.${layout.name}.jpg`),
				png
			);
		}
		console.log(post.slug);
	}

	await browser.close();
};

// For non-prod builds, this isn't needed
if (!process.env.BUILD_ENV || process.env.BUILD_ENV !== "dev") build();
