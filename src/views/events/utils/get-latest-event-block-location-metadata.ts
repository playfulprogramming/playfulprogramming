import { getUrlMetadata } from "#utils/hoof/index.ts";
import { events } from "../constants/index.ts";
import type { EventBlock } from "../types";
import type { LatestEventBlockLocationMetadataType } from "../components/event-cards/types.ts";

export async function getLatestEventBlockLocationMetadata() {
	// We only need the latest event block location metadata to show on the list view
	// Record<EventSlug, EventBlockWithMetadata>
	const metadata: LatestEventBlockLocationMetadataType = {};

	// Do not use `Promise.all`, as the getUrlMetadata retry logic may break builds when parallelism is enabled
	for (const event of events) {
		let nearestButNotPastEvent: EventBlock | null = null;
		// Find the nearest but not past event for each event
		for (const block of event.blocks) {
			// If the block is in the past, skip it
			if (block.starts_at < new Date()) {
				continue;
			}

			// If there is no nearest but not past event, set it to the current block
			if (!nearestButNotPastEvent) {
				nearestButNotPastEvent = block;
				continue;
			}

			// Otherwise, if there is a "nearest but not past" event, check if the current block is closer
			if (nearestButNotPastEvent.starts_at > block.starts_at) {
				nearestButNotPastEvent = block;
				continue;
			}
		}

		if (!nearestButNotPastEvent?.location_url) {
			continue;
		}

		const location_metadata = await getUrlMetadata(
			nearestButNotPastEvent.location_url,
		).catch(() => undefined);

		metadata[event.slug] = {
			...nearestButNotPastEvent,
			location_metadata,
		};
	}

	return metadata;
}
