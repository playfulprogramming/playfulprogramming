import { useLayoutEffect, useMemo, useState } from "preact/hooks";
import { events } from "./constants";
import {
	RadioButton,
	RadioButtonGroup,
} from "components/button-radio-group/button-radio-group";

import { useElementSize } from "../../hooks/use-element-size";

import filter from "src/icons/filter.svg?raw";
import style from "./events-page.module.scss";
import { Calendar } from "./components/calendar/calendar";
import { LongWave } from "./components/long-wave/long-wave";

type EventType = "all" | "online" | "in-person";

export default function SearchPageBase() {
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
			<Calendar />
			<div className={style.listsContainer}>
				{recurringEvents.length ? (
					<div className={style.listContainer}>
						<h2 className={`text-style-headline-5 ${style.listHeading}`}>
							Recurring events
						</h2>
						<ul className={style.list}>
							{recurringEvents.map((event) => (
								<li key={event.slug}>{event.title}</li>
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
								<li key={event.slug}>{event.title}</li>
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
