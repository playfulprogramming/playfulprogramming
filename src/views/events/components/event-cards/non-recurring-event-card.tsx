import type { NonRecurringEventsCardProps } from "./types.ts";
import { getHrefContainerProps } from "#utils/href-container-script.ts";
import date from "#src/assets/icons/date.svg?raw";
import style from "./non-recurring-event-card.module.scss";
import { useMemo } from "preact/hooks";
import { EventChip } from "../event-chip/event-chip.tsx";
import { m } from "#src/paraglide/messages.js";
import { getLocale } from "#src/paraglide/runtime.js";
import { toDate } from "#utils/date.ts";

export function NonRecurringEventsCard({ event }: NonRecurringEventsCardProps) {
	const locale = getLocale();

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
	const currentYear = new Date().getFullYear();
	const formatEventDate = (value: Date) => {
		const eventDate = toDate(value);
		return new Intl.DateTimeFormat(locale, {
			month: "long",
			day: "numeric",
			year: eventDate.getFullYear() !== currentYear ? "numeric" : undefined,
		}).format(eventDate);
	};
	const dateRange = m.events_card_date_range({
		startDate: formatEventDate(startsAt),
		endDate: formatEventDate(endsAt),
	});

	return (
		<li
			{...(event.has_event_page
				? getHrefContainerProps(`/events/${event.slug}`)
				: undefined)}
			className={style.recurringEventCard}
		>
			<div className={style.cardInnerContainer}>
				<div className={style.eventLeftContainer}>
					<a
						href={event.has_event_page ? `/events/${event.slug}` : undefined}
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
						/>
						<span>{dateRange}</span>
					</div>
					<ul
						className={style.chipsContainer}
						aria-label={m.events_card_event_type()}
					>
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
				{event?.location_description ? (
					<div className={style.eventRightContainer}>
						<h3 className={`text-style-body-medium-bold`}>
							{m.events_card_event_info()}
						</h3>
						<div className={style.nextEventInnerCard}>
							{event.event_banner_src ? (
								<img
									alt=""
									width={80}
									crossOrigin="anonymous"
									src={event.event_banner_src}
									className={style.topicCardImage}
								/>
							) : null}
							<div className={style.topicCardTextContainer}>
								<p className={`text-style-body-small-bold ${style.topicLocation}`}>
									{m.events_card_event_info_location()}
								</p>
								<p className={`text-style-body-small-bold ${style.topicDesc}`}>
									{event.location_description}
								</p>
								{event?.location_url ? (
									<a
										className={`text-style-body-small ${style.topicLink}`}
										href={event.location_url}
									>
										{event.location_url}
									</a>
								) : null}
							</div>
						</div>
					</div>
				) : null}
			</div>
		</li>
	);
}
