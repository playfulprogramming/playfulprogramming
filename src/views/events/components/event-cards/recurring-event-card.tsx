import dayjs from "dayjs";
import { Button } from "components/button/button";
import { RecurringEventsCardProps } from "./types";
import { getHrefContainerProps } from "utils/href-container-script";
import date from "src/icons/date.svg?raw";
import style from "./recurring-event-card.module.scss";
import { EventChip } from "../event-chip/event-chip";

export function RecurringEventsCard({
	latestEventBlockLocationMetadata,
	event,
}: RecurringEventsCardProps) {
	const latestEventBlockWithMetadata =
		latestEventBlockLocationMetadata[event.slug];

	const latestEventBannerSrc =
		latestEventBlockWithMetadata?.location_metadata.banner?.src;

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
					{latestEventBlockWithMetadata ? (
						<div className={`text-style-body-small-bold ${style.eventDate}`}>
							<span
								className={style.eventIcon}
								dangerouslySetInnerHTML={{ __html: date }}
							></span>
							<span>
								{dayjs(latestEventBlockWithMetadata.starts_at).format(
									"MMMM Do • h:mmA ",
								)}
								• <span className={style.nextEventText}>Next event</span>
							</span>
						</div>
					) : null}
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
				{latestEventBlockWithMetadata?.location_description ? (
					<div className={style.eventRightContainer}>
						<h3 className={`text-style-body-medium-bold`}>Next event's info</h3>
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
