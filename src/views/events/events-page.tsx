import { useLayoutEffect, useMemo, useState } from "preact/hooks";
import { events } from "./constants";
import {
	RadioButton,
	RadioButtonGroup,
} from "components/button-radio-group/button-radio-group";

import { useElementSize } from "../../hooks/use-element-size";

import { Calendar } from "./components/calendar/calendar";
import { LongWave } from "./components/long-wave/long-wave";
import { EventBlock, Event } from "./types";
import { UrlMetadataResponse } from "utils/hoof";
import filter from "src/icons/filter.svg?raw";
import style from "./events-page.module.scss";
import { getHrefContainerProps } from "utils/href-container-script";
import { Button } from "components/button/button";
import date from "src/icons/date.svg?raw";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

type EventType = "all" | "online" | "in-person";

type LatestEventBlockLocationMetadataType = Record<
	string,
	EventBlock & {
		location_metadata: UrlMetadataResponse;
	}
>;

interface EventsCardProps {
	event: Event;
	latestEventBlockLocationMetadata: LatestEventBlockLocationMetadataType;
}

function RecurringEventsCard({
	latestEventBlockLocationMetadata,
	event,
}: EventsCardProps) {
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

interface EventsPageProps {
	latestEventBlockLocationMetadata: LatestEventBlockLocationMetadataType;
}

export default function EventsPage({
	latestEventBlockLocationMetadata,
}: EventsPageProps) {
	const [eventTypesToShow, setEventTypesToShow] = useState("all" as EventType);

	const filteredEvents = useMemo(() => {
		if (eventTypesToShow === "all") {
			return events;
		}

		const inPerson = eventTypesToShow === "in-person";

		return events.filter((event) => event.in_person === inPerson);
	}, [eventTypesToShow]);

	const recurringEvents = useMemo(() => {
		return filteredEvents.filter((event) => event.is_recurring);
	}, [filteredEvents]);

	const nonRecurringEvents = useMemo(() => {
		return filteredEvents.filter((event) => !event.is_recurring);
	}, [filteredEvents]);

	/**
	 * Styles for header bar
	 */
	const { size, setEl } = useElementSize();

	useLayoutEffect(() => {
		const header = document.querySelector("#header-bar") as HTMLElement;
		setEl(header);
	}, []);

	const headerHeight = size.height;

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
					<h1 className={`text-style-headline-1 ${style.eventsTitle}`}>
						Events
					</h1>
					<div className={style.showButtonContainer}>
						<div className={style.showTextContainer}>
							<span
								className={style.filterIconContainer}
								dangerouslySetInnerHTML={{ __html: filter }}
							></span>
							<span className={`text-style-button-regular`}>Show:</span>
						</div>
						<RadioButtonGroup
							className={style.eventTypesToShowGroup}
							value={eventTypesToShow}
							label={"Show:"}
							onChange={(val) => setEventTypesToShow(val as EventType)}
						>
							<RadioButton value={"all"}>All Events</RadioButton>
							<RadioButton value={"online"}>Online</RadioButton>
							<RadioButton value={"in-person"}>In-person</RadioButton>
						</RadioButtonGroup>
					</div>
				</div>
				<LongWave />
			</div>
			<div className={style.listsContainer}>
				<Calendar events={filteredEvents} />
				{recurringEvents.length ? (
					<div className={style.listContainer}>
						<h2 className={`text-style-headline-5 ${style.listHeading}`}>
							Recurring events
						</h2>
						<ul className={style.list} role={"list"}>
							{recurringEvents.map((event) => (
								<RecurringEventsCard
									key={event.slug}
									event={event}
									latestEventBlockLocationMetadata={
										latestEventBlockLocationMetadata
									}
								/>
							))}
						</ul>
					</div>
				) : null}
				{nonRecurringEvents.length ? (
					<div className={style.listContainer}>
						<h2 className={`text-style-headline-5 ${style.listHeading}`}>
							Special events
						</h2>
						<ul className={style.list}>
							{nonRecurringEvents.map((event) => (
								<RecurringEventsCard
									key={event.slug}
									event={event}
									latestEventBlockLocationMetadata={
										latestEventBlockLocationMetadata
									}
								/>
							))}
						</ul>
					</div>
				) : null}
				<div style={{ height: "200vh" }} />
				{/*	TODO: Make empty state if neither is present */}
			</div>
		</div>
	);
}
