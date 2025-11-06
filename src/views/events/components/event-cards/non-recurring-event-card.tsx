import dayjs from "dayjs";
import { NonRecurringEventsCardProps } from "./types";
import { getHrefContainerProps } from "utils/href-container-script";
import date from "src/icons/date.svg?raw";
import style from "./non-recurring-event-card.module.scss";
import { useMemo } from "preact/hooks";
import { EventChip } from "../event-chip/event-chip";

export function NonRecurringEventsCard({ event }: NonRecurringEventsCardProps) {
	// Helps us get the event with the earliest start time
	const startSortedEventBlocks = useMemo(
		() =>
			[...event.blocks].sort(
				(a, b) => a.starts_at.valueOf() - b.starts_at.valueOf(),
			),
		[event],
	);
	// Helps us get the event with the latest end time
	const endsSortedEventBlocks = useMemo(
		() =>
			[...event.blocks].sort(
				(a, b) => b.ends_at.valueOf() - a.ends_at.valueOf(),
			),
		[event],
	);

	const startsAt = startSortedEventBlocks[0]?.starts_at;
	const endsAt = endsSortedEventBlocks[0]?.ends_at;

	return (
		<li
			{...getHrefContainerProps(`/events/${event.slug}`)}
			className={style.recurringEventCard}
		>
			<div className={style.cardInnerContainer}>
				<div className={style.eventLeftContainer}>
					<a
						href={`/events/${event.slug}`}
						className={style.recurringEventCardTitleLink}
					>
						<h2
							className={`text-style-headline-4 ${style.recurringEventCardTitle}`}
						>
							{event.title}
						</h2>
					</a>
					<div className={`text-style-body-small-bold ${style.eventDate}`}>
						<span
							className={style.eventIcon}
							dangerouslySetInnerHTML={{ __html: date }}
						></span>
						<span>
							{dayjs(startsAt).format("MMMM Do")} —{" "}
							{dayjs(endsAt).format("MMMM Do")}
						</span>
					</div>
					<ul className={style.chipsContainer} aria-label="Event type">
						{event.in_person && (
							<li>
								<EventChip variant={"in-person"} size={"compact"} />
							</li>
						)}
						{event.is_online && (
							<li>
								<EventChip variant={"online"} size={"compact"} />
							</li>
						)}
					</ul>
					<p className={`text-style-body-small ${style.eventDescription}`}>
						{event.description}
					</p>
				</div>
			</div>
		</li>
	);
}
