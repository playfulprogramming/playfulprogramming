import { type Browser, chromium, firefox, webkit } from "playwright";
import {
	getScreenshots,
	runImageDiff,
	type BrowserTypes,
	type ScreenshotData,
} from "storybook-addon-playwright";
import { setConfig } from "storybook-addon-playwright/configs";

const browserTypes = { chromium, firefox, webkit };
const browsers = new Map<BrowserTypes, Browser>();

async function getBrowser(browserType: BrowserTypes) {
	const existingBrowser = browsers.get(browserType);

	if (existingBrowser?.isConnected()) {
		return existingBrowser;
	}

	const browser = await browserTypes[browserType].launch();
	browsers.set(browserType, browser);

	return browser;
}

setConfig({
	storybookEndpoint: process.env.STORYBOOK_ENDPOINT ?? "http://127.0.0.1:6006/",
	storyRenderTimeout: 30_000,
	getPage: async (browserType, options) => {
		const browser = await getBrowser(browserType);
		return browser.newPage(options);
	},
	beforeScreenshot: async (page) => {
		await page.evaluate(async () => {
			await document.fonts?.ready;

			await Promise.all(
				Array.from(document.images, (image) => {
					if (image.complete) return undefined;

					return new Promise((resolve) => {
						image.addEventListener("load", resolve, { once: true });
						image.addEventListener("error", resolve, { once: true });
					});
				}),
			);
		});
	},
	afterScreenshot: async (page) => {
		await page.close();
	},
});

export type AddonScreenshotSetting = ScreenshotData;

export { getScreenshots };

export async function closeBrowsers() {
	await Promise.all(
		Array.from(browsers.values(), (browser) => browser.close()),
	);
	browsers.clear();
}

export function runAddonImageDiff(requestId: string) {
	return runImageDiff("*", { requestId, requestType: "all" });
}
