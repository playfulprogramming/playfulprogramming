import { chromium } from "playwright";
import { promises as fsPromises } from "fs";
import { resolve } from "path";
import * as api from "utils/api";
import { renderPostPreviewToString } from "./shared-post-preview-png";
import { Layout, PAGE_HEIGHT, PAGE_WIDTH } from "./base";
import banner from "./layouts/banner";
import twitterPreview from "./layouts/twitter-preview";
import { PostInfo } from "types/PostInfo";

if (!process.env.CI) process.exit(0);

const browser_args = [
	"--allow-running-insecure-content",
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
	"--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process",
	"--disable-hang-monitor",
	"--disable-ipc-flooding-protection",
	"--disable-notifications",
	"--disable-offer-store-unmasked-wallet-cards",
	"--disable-popup-blocking",
	"--disable-print-preview",
	"--disable-prompt-on-repost",
	"--disable-renderer-backgrounding",
	"--disable-setuid-sandbox",
	"--disable-site-isolation-trials",
	"--disable-speech-api",
	"--disable-sync",
	"--disable-web-security",
	"--disk-cache-size=33554432",
	"--enable-features=SharedArrayBuffer",
	"--hide-scrollbars",
	"--ignore-gpu-blocklist",
	"--in-process-gpu",
	"--metrics-recording-only",
	"--mute-audio",
	"--no-default-browser-check",
	"--no-first-run",
	"--no-pings",
	"--no-sandbox",
	"--no-zygote",
	"--password-store=basic",
	"--single-process",
	"--use-mock-keychain",
	"--window-size=1920,1080",
];

const browser = await chromium.launch({
	args: browser_args,
});
const context = await browser.newContext({
	viewport: {
		width: PAGE_WIDTH,
		height: PAGE_HEIGHT,
	},
	javaScriptEnabled: false,
});
const page = await context.newPage();

async function renderPostImage(layout: Layout, post: PostInfo, path: string) {
	const label = `${post.slug} (${layout.name})`;
	console.time(label);

	await page.setContent(await renderPostPreviewToString(layout, post), {
		timeout: 0,
	});
	await page.screenshot({ type: "jpeg", path });

	console.timeEnd(label);
}

// Relative to root
const outDir = resolve(process.cwd(), "./public");
await fsPromises.mkdir(resolve(outDir, "./generated"), { recursive: true });

/**
 * This is done synchronously, in order to prevent more than a single instance
 * of the browser from running at the same time.
 */
for (const post of api.getPostsByLang("en")) {
	if (post.socialImg) {
		await renderPostImage(
			twitterPreview,
			post,
			resolve(outDir, `.${post.socialImg}`),
		);
	}
}

for (const post of api.getPostsByLang("en")) {
	if (post.bannerImg) {
		await renderPostImage(banner, post, resolve(outDir, `.${post.bannerImg}`));
	}
}

await context.close();
await browser.close();
