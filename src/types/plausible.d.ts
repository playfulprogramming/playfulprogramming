import type { EventOptions, PlausibleOptions } from "plausible-tracker";

export {};

declare global {
	const plausible: (
		eventName: string,
		options?: EventOptions,
		eventData?: PlausibleOptions,
	) => void;
}
