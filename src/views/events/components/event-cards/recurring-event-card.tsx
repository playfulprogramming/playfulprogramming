import { Button } from "#components/button/button.tsx";
import type { RecurringEventsCardProps } from "./types.ts";
import { getHrefContainerProps } from "#utils/href-container-script.ts";
import date from "#src/icons/date.svg?raw";
import style from "./recurring-event-card.module.scss";
import { EventChip } from "../event-chip/event-chip.tsx";
import { m } from "#src/paraglide/messages.js";
import { getLocale } from "#src/paraglide/runtime.js";

export function RecurringEventsCard({
	latestEventBlockLocationMetadata,
	event,
}: RecurringEventsCardProps) {
	const locale = getLocale();
	const latestEventBlockWithMetadata =
		latestEventBlockLocationMetadata[event.slug];

	const latestEventBannerSrc =
		latestEventBlockWithMetadata?.location_metadata?.banner?.src;
	const latestEventDate = latestEventBlockWithMetadata
		? new Intl.DateTimeFormat(locale, {
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
			}).format(latestEventBlockWithMetadata.starts_at)
		: undefined;

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
					{latestEventBlockWithMetadata ? (
						<div className={`text-style-body-small-bold ${style.eventDate}`}>
							<span
								className={style.eventIcon}
								dangerouslySetInnerHTML={{ __html: date }}
							/>
							<span>
								<span className={style.nextEventText}>
									{m.events_card_next_event_date({ date: latestEventDate! })}
								</span>
							</span>
						</div>
					) : null}
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
				{latestEventBlockWithMetadata?.location_description ? (
					<div className={style.eventRightContainer}>
						<h3 className={`text-style-body-medium-bold`}>
							{m.events_card_next_event_info()}
						</h3>
						<div className={style.nextEventInnerCard}>
							{latestEventBannerSrc ? (
								<img
									alt=""
									width={80}
									crossOrigin="anonymous"
									src={latestEventBannerSrc}
									className={style.topicCardImage}
								/>
							) : null}
							<div className={style.topicCardTextContainer}>
								<p className={`text-style-body-small-bold ${style.topicDesc}`}>
									{latestEventBlockWithMetadata.location_description}
								</p>
								{latestEventBlockWithMetadata?.location_url ? (
									<a
										className={`text-style-body-small ${style.topicLink}`}
										href={latestEventBlockWithMetadata.location_url}
									>
										{latestEventBlockWithMetadata.location_url}
									</a>
								) : null}
							</div>
						</div>
					</div>
				) : null}
			</div>
			{event.location_url && event.location_description ? (
				<div className={style.buttonContainer}>
					<Button href={event.location_url} variant="primary">
						{event.location_description}
					</Button>
				</div>
			) : null}
		</li>
	);
}
