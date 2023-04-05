import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { promises as fsPromises } from "fs";
import { resolve } from "path";
import { getPosts } from "utils/get-all-posts";
import { PostInfo } from "types/index";
import { layouts, renderPostPreviewToString } from "./shared-post-preview-png";
import { Layout, PAGE_HEIGHT, PAGE_WIDTH } from "./base";

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

const browser: Promise<puppeteer.Browser> = chromium.puppeteer.launch({
	args: [...chromium.args, ...browser_args],
	defaultViewport: {
		width: PAGE_WIDTH,
		height: PAGE_HEIGHT,
	},
	executablePath: await chromium.executablePath,
	headless: true,
	ignoreHTTPSErrors: true,
	userDataDir: "./.puppeteer",
});

const page: Promise<puppeteer.Page> = browser.then((b) => b.newPage());

async function renderPostImage(layout: Layout, post: PostInfo) {
	const label = `${post.slug} (${layout.name})`;
	console.time(label);

	const browserPage = await page;
	await browserPage.setContent(await renderPostPreviewToString(layout, post));
	const buffer = (await browserPage.screenshot({ type: "jpeg" })) as Buffer;

	console.timeEnd(label);
	return buffer;
}

const build = async () => {
	// Relative to root
	const outDir = resolve(process.cwd(), "./public/generated");
	await fsPromises.mkdir(outDir, { recursive: true });

	/**
	 * This is done synchronously, in order to prevent more than a single instance
	 * of the browser from running at the same time.
	 */
	for (const post of getPosts("en")) {
		for (const layout of layouts) {
			const buffer = await renderPostImage(layout, post);
			await fsPromises.writeFile(
				resolve(outDir, `${post.slug}.${layout.name}.jpg`),
				buffer
			);
		}
	}

	await (await browser).close();
};

// For non-prod builds, this isn't needed
if (!process.env.BUILD_ENV || process.env.BUILD_ENV !== "dev") build();
