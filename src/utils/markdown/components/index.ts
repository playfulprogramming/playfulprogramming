import { fileTree } from "./filetree";
import { inContentAd } from "./in-content-ad";
import { tabs } from "./tabs";

export * from "./types";
export * from "./tabs";

export const components = {
	filetree: fileTree,
	["in-content-ad"]: inContentAd,
	["no-ebook"]: ({ children }) => children,
	["only-ebook"]: () => [],
	tabs: tabs,
};
