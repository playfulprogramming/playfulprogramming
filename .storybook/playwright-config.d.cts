import type { BrowserContextOptions, PageScreenshotOptions } from "playwright";

export type AddonBrowserType = "chromium" | "firefox" | "webkit";

export interface AddonAction {
	id: string;
	name: string;
	args?: Record<string, unknown>;
	labe?: string;
	subtitleItems?: string[];
}

export interface AddonActionSet {
	id: string;
	title: string;
	actions: AddonAction[];
	temp?: boolean;
}

export interface AddonScreenshotSetting {
	id: string;
	title: string;
	browserType: AddonBrowserType;
	actionSets?: AddonActionSet[];
	args?: Record<string, unknown>;
	browserOptions?: BrowserContextOptions;
	globals?: Record<string, unknown>;
	props?: Record<string, unknown>;
	screenshotOptions?: PageScreenshotOptions;
}

export interface AddonImageDiffResult {
	added?: boolean;
	diffPixelCount?: number;
	error?: string;
	filePath?: string;
	newScreenshot?: string;
	pass?: boolean;
	screenshotId?: string;
	storyId?: string;
	screenshotData?: Pick<AddonScreenshotSetting, "browserType">;
}

export function closeBrowsers(): Promise<void>;
export function runAddonImageDiff(
	requestId: string,
): Promise<AddonImageDiffResult[]>;
export function takeAddonScreenshot(
	input: Omit<AddonScreenshotSetting, "id" | "title"> & {
		requestId: string;
		requestType: "all";
		storyId: string;
	},
): Promise<{
	base64?: string;
	browserName: AddonBrowserType;
	buffer: Buffer;
}>;
