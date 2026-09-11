import { useLayoutEffect, useMemo, useState } from "preact/hooks";
import {
	RadioButton,
	RadioButtonGroup,
} from "#components/button-radio-group/button-radio-group.tsx";

import { useElementSize } from "../../hooks/use-element-size.tsx";

import {
	Calendar,
	type CalendarVisibleRange,
} from "./components/calendar/calendar.tsx";
import { Button } from "#components/button/button.tsx";
import { LongWave } from "./components/long-wave/long-wave.tsx";
import filter from "#src/assets/icons/filter.svg?raw";
import style from "./events-page.module.scss";
import type { LatestEventBlockLocationMetadataType } from "./components/event-cards/types.ts";
import { RecurringEventsCard } from "./components/event-cards/recurring-event-card.tsx";
import { NonRecurringEventsCard } from "./components/event-cards/non-recurring-event-card.tsx";
import type { Event } from "./types";
import { m } from "#src/paraglide/messages.js";

type EventType = "all" | "online" | "in-person";

interface EventsPageProps {
	latestEventBlockLocationMetadata: LatestEventBlockLocationMetadataType;
	events: Event[];
}

export default function EventsPage({
	latestEventBlockLocationMetadata,
	events,
}: EventsPageProps) {
	const [eventTypesToShow, setEventTypesToShow] = useState("all" as EventType);
	const [visibleRange, setVisibleRange] = useState<CalendarVisibleRange | null>(
		null,
	);

	const filteredEvents = useMemo(() => {
		if (eventTypesToShow === "all") {
			return events;
		}

		if (eventTypesToShow === "online") {
			return events.filter((event) => event.is_online);
		}

		return events.filter((event) => event.in_person);
	}, [eventTypesToShow, events]);

	const visibleEvents = useMemo(() => {
		if (!visibleRange) return [];

		return filteredEvents.filter((event) =>
			event.blocks.some(
				(block) =>
					block.starts_at.getTime() < visibleRange.end &&
					block.ends_at.getTime() > visibleRange.start,
			),
		);
	}, [filteredEvents, visibleRange]);

	const recurringEvents = useMemo(() => {
		return visibleEvents.filter((event) => event.is_recurring);
	}, [visibleEvents]);

	const nonRecurringEvents = useMemo(() => {
		return visibleEvents.filter((event) => !event.is_recurring);
	}, [visibleEvents]);

	const visibleEventBlockLocationMetadata = useMemo(() => {
		if (!visibleRange) return {};

		return Object.fromEntries(
			Object.entries(latestEventBlockLocationMetadata).filter(
				([, block]) =>
					block.starts_at.getTime() < visibleRange.end &&
					block.ends_at.getTime() > visibleRange.start,
			),
		);
	}, [latestEventBlockLocationMetadata, visibleRange]);

	/**
	 * Styles for header bar
	 */
	const { size, setEl } = useElementSize();

	useLayoutEffect(() => {
		const header = document.querySelector("#header-bar") as HTMLElement;
		setEl(header);
	}, [setEl]);

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
						{m.title_events()}
					</h1>
					<div className={style.showButtonContainer}>
						<div className={style.showTextContainer}>
							<span
								className={style.filterIconContainer}
								dangerouslySetInnerHTML={{ __html: filter }}
							/>
							<span className={`text-style-button-regular`}>
								{m.events_filter_show()}
							</span>
						</div>
						<RadioButtonGroup
							className={style.eventTypesToShowGroup}
							value={eventTypesToShow}
							label={m.events_filter_show()}
							onChange={(val) => setEventTypesToShow(val as EventType)}
						>
							<RadioButton value={"all"}>{m.events_filter_all()}</RadioButton>
							<RadioButton value={"online"}>
								{m.events_type_online()}
							</RadioButton>
							<RadioButton value={"in-person"}>
								{m.events_type_in_person()}
							</RadioButton>
						</RadioButtonGroup>
					</div>
				</div>
				<LongWave />
			</div>
			<div className={style.listsContainer}>
				<Calendar
					events={filteredEvents}
					onVisibleRangeChange={setVisibleRange}
				/>
				{nonRecurringEvents.length ? (
					<div className={style.listContainer}>
						<h2 className={`text-style-headline-5 ${style.listHeading}`}>
							{m.events_section_special()}
						</h2>
						<ul className={style.list}>
							{nonRecurringEvents.map((event) => (
								<NonRecurringEventsCard key={event.slug} event={event} />
							))}
						</ul>
					</div>
				) : null}
				{recurringEvents.length ? (
					<div className={style.listContainer}>
						<h2 className={`text-style-headline-5 ${style.listHeading}`}>
							{m.events_section_recurring()}
						</h2>
						<ul className={style.list} role={"list"}>
							{recurringEvents.map((event) => (
								<RecurringEventsCard
									key={event.slug}
									event={event}
									latestEventBlockLocationMetadata={
										visibleEventBlockLocationMetadata
									}
								/>
							))}
						</ul>
					</div>
				) : null}
				{visibleRange && !visibleEvents.length && (
					<div className={style.emptyState}>
						<h2 className="text-style-headline-5">{m.events_empty_title()}</h2>
						<p className="text-style-body-large">
							{m.events_empty_description()}
						</p>
						<Button href="https://discord.playfulprogramming.com">
							{m.action_join_discord()}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
