import { Event, EventBlock } from "../../types";
import { UrlMetadataResponse } from "utils/hoof";

export interface EventsCardProps {
	event: Event;
	latestEventBlockLocationMetadata: LatestEventBlockLocationMetadataType;
}

export type LatestEventBlockLocationMetadataType = Record<
	string,
	EventBlock & {
		location_metadata: UrlMetadataResponse;
	}
>;
