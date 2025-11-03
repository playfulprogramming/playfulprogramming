import { useLayoutEffect, useMemo } from "preact/hooks";

import { useElementSize } from "../../hooks/use-element-size";
import { LongWave } from "../events/components/long-wave/long-wave";
import { EventBlock } from "../events/types";
import { UrlMetadataResponse } from "utils/hoof";
import style from "./book-club.module.scss";
import { EventChip } from "../events/components/event-chip/event-chip";
import { LargeButton } from "components/button/button";
import dayjs from "dayjs";

interface EventBlockWithMetadata extends EventBlock {
	location_metadata: UrlMetadataResponse;
}

interface EventsPageProps {
	eventBlocksWithMetadata: EventBlockWithMetadata[];
}

export default function EventsPage({
	eventBlocksWithMetadata,
}: EventsPageProps) {
	/**
	 * Styles for header bar
	 */
	const { size, setEl } = useElementSize();

	useLayoutEffect(() => {
		const header = document.querySelector("#header-bar") as HTMLElement;
		setEl(header);
	}, []);

	const headerHeight = size.height;

	const sortedEventBlocks = useMemo(() => {
		return [...eventBlocksWithMetadata].sort((a, b) => {
			return a.starts_at.getTime() - b.starts_at.getTime();
		});
	}, [eventBlocksWithMetadata]);

	const { pastEventBlocks, currentEventBlock } = useMemo(() => {
		const pastEventBlocks: EventBlockWithMetadata[] = [];
		const now = new Date();

		let currentEventIndex = -1;
		for (let i = 0; i < sortedEventBlocks.length; i++) {
			const block = sortedEventBlocks[i];
			if (block.starts_at < now) {
				pastEventBlocks.push(block);
				continue;
			}

			// Because the events are sorted chronologically, we can do this safely
			currentEventIndex = i;
			break;
		}

		const currentEventBlock = sortedEventBlocks.slice(currentEventIndex);

		return { pastEventBlocks, currentEventBlock };
	}, [sortedEventBlocks]);

	return (
		<div className={style.container}>
			<div
				className={style.titleContainer}
				style={{
					top: headerHeight,
					position: "sticky",
					// this should be overflow: clip; to prevent the browser scrolling within the element when a filter checkbox is focused:
					// https://stackoverflow.com/q/75419337
					// https://github.com/playfulprogramming/playfulprogramming/issues/653
					overflow: "clip",
				}}
			>
				<div className={style.backgroundTop}>
					<div className={style.topText}>
						<h1 className={`text-style-headline-1 ${style.eventsTitle}`}>
							Book Club
							<span className={style.eventChipContainer}>
								<EventChip size={"compact"} variant={"online"} />
							</span>
						</h1>
						<p
							className={`text-style-body-large`}
							style={{ fontStyle: "italic" }}
						>
							In our weekly book club, we hang out and chat about a topic or a
							specific article!
						</p>
					</div>
					<LargeButton
						href={"https://discord.gg/FMcvc6T"}
						variant={"primary-emphasized"}
					>
						Join our Discord
					</LargeButton>
				</div>
				<LongWave />
			</div>
			<div className={style.listsContainer}>
				<ul>
					{currentEventBlock.map((block) => {
						return (
							<li key={block.slug}>
								{dayjs(block.starts_at).format("dddd, MMM D")}
								<br />
								{block.title}
								<br />
								{block.location_url}
								<br />
								<br />
							</li>
						);
					})}
				</ul>
				<h2>Archived</h2>
				<ul>
					{pastEventBlocks.map((block) => {
						return (
							<li key={block.slug}>
								{dayjs(block.starts_at).format("dddd, MMM D")}
								<br />
								{block.title}
								<br />
								{block.location_url}
								<br />
								<br />
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
