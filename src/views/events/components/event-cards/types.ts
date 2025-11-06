import { Event, EventBlock } from "../../types";
import { UrlMetadataResponse } from "utils/hoof";

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
		location_metadata: UrlMetadataResponse;
	}
>;
