import { useMemo, useState } from "preact/hooks";
import { events } from "./constants";
import {
	RadioButton,
	RadioButtonGroup,
} from "components/button-radio-group/button-radio-group";
import styles from "./events-page.module.scss"

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

	return (
		<div className={styles.container}>
			<h1 className={"text-style-headline-1"}>Events</h1>
			<div>
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
			<ul>
				{filteredEvents.map((event) => (
					<li key={event.slug}>{event.title}</li>
				))}
			</ul>
		</div>
	);
}
