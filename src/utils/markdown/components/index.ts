import { fileTree } from "./filetree";
import { inContentAd } from "./in-content-ad";
import { tabs } from "./tabs";
import { keepContent } from "./keep-content";
import { removeContent } from "./remove-content";

export * from "./types";
export * from "./rehype-transform";

const commonComponents = {
	filetree: fileTree,
	["in-content-ad"]: inContentAd,
};

export const htmlComponents = {
	...commonComponents,
	["no-ebook"]: keepContent,
	["only-ebook"]: removeContent,
	tabs: tabs,
};

export const epubComponents = {
	...commonComponents,
	["no-ebook"]: removeContent,
	["only-ebook"]: keepContent,
	tabs: keepContent,
};
