import type { track } from "@plausible-analytics/tracker";

export {};

declare global {
	interface Window {
		plausible: track;
	}
}
