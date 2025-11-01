import { useMemo, useState } from "preact/hooks";
import { events } from "./constants";
import {
	RadioButton,
	RadioButtonGroup,
} from "components/button-radio-group/button-radio-group";
import styles from "./events-page.module.scss";

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

	return (
		<div className={styles.container}>
			<div className={styles.titleContainer}>
				<h1 className={`text-style-headline-1 ${styles.eventsTitle}`}>
					Events
				</h1>
				<RadioButtonGroup
					className={styles.eventTypesToShowGroup}
					value={eventTypesToShow}
					label={"Show:"}
					onChange={(val) => setEventTypesToShow(val as EventType)}
				>
					<RadioButton value={"all"}>All Events</RadioButton>
					<RadioButton value={"online"}>Online</RadioButton>
					<RadioButton value={"in-person"}>In-person</RadioButton>
				</RadioButtonGroup>
			</div>
			<div className={styles.listsContainer}>
				{recurringEvents.length ? (
					<div className={styles.listContainer}>
						<h2 className={`text-style-headline-5 ${styles.listHeading}`}>
							Recurring events
						</h2>
						<ul className={styles.list}>
							{recurringEvents.map((event) => (
								<li key={event.slug}>{event.title}</li>
							))}
						</ul>
					</div>
				) : null}
				{nonRecurringEvents.length ? (
					<div className={styles.listContainer}>
						<h2 className={`text-style-headline-5 ${styles.listHeading}`}>
							Special events
						</h2>
						<ul className={styles.list}>
							{nonRecurringEvents.map((event) => (
								<li key={event.slug}>{event.title}</li>
							))}
						</ul>
					</div>
				) : null}
				{/*	TODO: Make empty state if neither is present */}
			</div>
		</div>
	);
}
