import { useLayoutEffect, useMemo } from "preact/hooks";

import { useElementSize } from "../../hooks/use-element-size";
import { LongWave } from "../events/components/long-wave/long-wave";
import { EventBlock } from "../events/types";
import { UrlMetadataResponse } from "utils/hoof";
import { EventChip } from "../events/components/event-chip/event-chip";
import { LargeButton } from "components/button/button";
import dayjs from "dayjs";
import { getHrefContainerProps } from "utils/href-container-script";
import style from "./book-club.module.scss";

interface EventBlockWithMetadata extends EventBlock {
	location_metadata: UrlMetadataResponse;
}

interface BookClubLargeCardProps {
	eventBlock: EventBlockWithMetadata;
}

const defaultCoverImage = "/illustrations/illustration-webpage.svg";

function BookClubLargeCard({ eventBlock }: BookClubLargeCardProps) {
	if (!eventBlock.location_url) return null;

	return (
		<li className={style.largeCardContainer}>
			<p className={`text-style-headline-5 ${style.largeEventBlockDate}`}>
				{dayjs(eventBlock.starts_at).format("dddd, MMM D")}
			</p>
			<div
				className={style.largeCard}
				{...getHrefContainerProps(eventBlock.location_url)}
			>
				<img
					className={style.largeCardImage}
					crossOrigin={"anonymous"}
					src={eventBlock.location_metadata.banner?.src ?? defaultCoverImage}
					alt=""
					height={315}
				/>
				<div className={style.largeTextContainer}>
					<p className={`text-style-headline-6 ${style.largeEventBlockName}`}>
						{eventBlock.location_description}
					</p>
					<a
						className={`text-style-body-small-bold ${style.largeEventBlockLocation}`}
						href={eventBlock.location_url}
					>
						{eventBlock.location_url}
					</a>
				</div>
			</div>
		</li>
	);
}

interface BookClubSmallCardProps {
	eventBlock: EventBlockWithMetadata;
}

function BookClubSmallCard({ eventBlock }: BookClubSmallCardProps) {
	if (!eventBlock.location_url) return null;

	return (
		<li className={style.smallCardContainer}>
			<p className={`text-style-headline-5 ${style.smallEventBlockDate}`}>
				{dayjs(eventBlock.starts_at).format("dddd, MMM D")}
			</p>
			<div
				className={style.smallCard}
				{...getHrefContainerProps(eventBlock.location_url)}
			>
				<img
					className={style.smallCardImage}
					crossOrigin={"anonymous"}
					src={eventBlock.location_metadata.banner?.src ?? defaultCoverImage}
					alt=""
					width={171}
					height={96}
				/>
				<div className={style.smallTextContainer}>
					<p className={`text-style-headline-6 ${style.smallEventBlockName}`}>
						{eventBlock.location_description}
					</p>
					<a
						className={`text-style-body-small-bold ${style.smallEventBlockLocation}`}
						href={eventBlock.location_url}
					>
						{eventBlock.location_url}
					</a>
				</div>
			</div>
		</li>
	);
}

interface BookClubProps {
	eventBlocksWithMetadata: EventBlockWithMetadata[];
}

export default function BookClub({ eventBlocksWithMetadata }: BookClubProps) {
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
				<ul className={style.largeCardList}>
					{currentEventBlock.map((block) => (
						<BookClubLargeCard eventBlock={block} key={block.slug} />
					))}
				</ul>
				<h2>Archived</h2>
				<ul className={style.smallCardList}>
					{pastEventBlocks.map((block) => (
						<BookClubSmallCard eventBlock={block} key={block.slug} />
					))}
				</ul>
			</div>
		</div>
	);
}
