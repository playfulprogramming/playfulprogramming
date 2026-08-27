import type { Event, EventBlock } from "../../types.ts";
import type { UrlMetadataResponse } from "#utils/hoof/index.ts";

export interface RecurringEventsCardProps {
	event: Event;
	latestEventBlockLocationMetadata: LatestEventBlockLocationMetadataType;
}

export interface NonRecurringEventsCardProps {
	event: Event;
}

export type LatestEventBlockLocationMetadataType = Record<
	string,
	EventBlock & {
		location_metadata?: UrlMetadataResponse;
	}
>;
