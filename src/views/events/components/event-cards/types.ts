import type { Event, EventBlock } from "../../types.ts";
import type { UrlMetadataResponse } from "#utils/hoof/index.ts";
import type { Languages } from "#types/index.ts";
import type { Translate } from "#utils/translations.ts";

export interface RecurringEventsCardProps {
	event: Event;
	latestEventBlockLocationMetadata: LatestEventBlockLocationMetadataType;
	locale: Languages;
	translate: Translate;
}

export interface NonRecurringEventsCardProps {
	event: Event;
	locale: Languages;
	translate: Translate;
}

export type LatestEventBlockLocationMetadataType = Record<
	string,
	EventBlock & {
		location_metadata?: UrlMetadataResponse;
	}
>;
