const { dirname, join } = require("node:path");

const { chromium, firefox, webkit } = require("playwright");

function loadAddonServer() {
	const previousDocument = Object.getOwnPropertyDescriptor(
		globalThis,
		"document",
	);
	const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
	const previousJestWorkerId = process.env.JEST_WORKER_ID;
	const fakeElement = {
		appendChild() {},
		setAttribute() {},
	};

	try {
		// The Storybook 8 UI dependencies bundled into the add-on are evaluated
		// even when its server-only config is loaded under Storybook 10.
		globalThis.document = {
			addEventListener() {},
			createElement() {
				return fakeElement;
			},
			createTextNode() {
				return fakeElement;
			},
			documentElement: {},
			getElementsByTagName() {
				return [fakeElement];
			},
			head: fakeElement,
			readyState: "loading",
		};
		globalThis.window = globalThis;
		process.env.JEST_WORKER_ID = previousJestWorkerId ?? "storybook-playwright";

		const addonRoot = dirname(
			require.resolve("storybook-addon-playwright/package.json"),
		);

		return require(join(addonRoot, "dist/trpc/router.js"));
	} finally {
		if (previousDocument) {
			Object.defineProperty(globalThis, "document", previousDocument);
		} else {
			delete globalThis.document;
		}

		if (previousWindow) {
			Object.defineProperty(globalThis, "window", previousWindow);
		} else {
			delete globalThis.window;
		}

		if (previousJestWorkerId === undefined) {
			delete process.env.JEST_WORKER_ID;
		} else {
			process.env.JEST_WORKER_ID = previousJestWorkerId;
		}
	}
}

const { appRouter, setConfig } = loadAddonServer();

const browserTypes = { chromium, firefox, webkit };
const browsers = new Map();

async function getBrowser(browserType) {
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

async function closeBrowsers() {
	await Promise.all(
		Array.from(browsers.values(), (browser) => browser.close()),
	);
	browsers.clear();
}

const addonCaller = appRouter.createCaller({});

async function runAddonImageDiff(requestId) {
	return addonCaller.screenshot.testScreenshots({
		filePath: "",
		requestId,
		requestType: "all",
		storyId: "",
	});
}

async function takeAddonScreenshot(input) {
	return addonCaller.screenshot.takeScreenshot(input);
}

module.exports = {
	closeBrowsers,
	runAddonImageDiff,
	takeAddonScreenshot,
};
