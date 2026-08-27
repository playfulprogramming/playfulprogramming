import type { Event, EventBlock } from "../../types.ts";
import type { UrlMetadataResponse } from "#utils/hoof/index.ts";
import type { Locale } from "#src/paraglide/runtime.js";

export interface RecurringEventsCardProps {
	event: Event;
	latestEventBlockLocationMetadata: LatestEventBlockLocationMetadataType;
	locale: Locale;
}

export interface NonRecurringEventsCardProps {
	event: Event;
	locale: Locale;
}

export type LatestEventBlockLocationMetadataType = Record<
	string,
	EventBlock & {
		location_metadata?: UrlMetadataResponse;
	}
>;
