import { useLayoutEffect, useMemo, useState } from "preact/hooks";
import { events } from "./constants";
import {
	RadioButton,
	RadioButtonGroup,
} from "components/button-radio-group/button-radio-group";

import { useElementSize } from "../../hooks/use-element-size";

import filter from "src/icons/filter.svg?raw";
import longWave from "../../../public/patterns/long_wave.svg?raw";
import style from "./events-page.module.scss";
import { useWindowSize } from "../../hooks/use-window-size";
import { mobile } from "../../tokens/breakpoints";
import {
	Button,
	ButtonContext,
	ButtonProps,
	Calendar,
	CalendarCell,
	CalendarGrid,
	Heading,
	useContextProps,
} from "react-aria-components";
import arrow_left from "../../icons/arrow_left.svg?raw";
import arrow_right from "../../icons/arrow_right.svg?raw";
import { IconOnlyButton } from "components/button/button";
import { ForwardedRef, forwardRef } from "preact/compat";
import { useButton } from "react-aria";

type EventType = "all" | "online" | "in-person";

const CustomButton = forwardRef(
	(
		props: ButtonProps & {
			dangerouslySetInnerHTML: { __html: string };
		},
		ref: ForwardedRef<HTMLButtonElement>,
	) => {
		[props, ref] = useContextProps(props, ref, ButtonContext);

		const { buttonProps } = useButton(props, ref);

		return (
			<IconOnlyButton
				children={[]}
				{...buttonProps}
				dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
				tag={"button"}
				ref={ref as never}
			/>
		);
	},
);

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

	const windowSize = useWindowSize();

	const isMobile = windowSize.width <= mobile;

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
				<div className={style.loopContainer}>
					<div className={style.loop_line}>
						<span
							className={style.longWaveSpan}
							dangerouslySetInnerHTML={{ __html: longWave }}
						></span>
						<span
							className={style.longWaveSpan}
							dangerouslySetInnerHTML={{ __html: longWave }}
						></span>
						<span
							className={style.longWaveSpan}
							dangerouslySetInnerHTML={{ __html: longWave }}
						></span>
					</div>
					<div className={style.loopFade} />
					<div className={style.loopFadeRight} />
				</div>
			</div>
			<Calendar
				className={style.calendar}
				aria-label="Events calendar"
				visibleDuration={{ months: 3 }}
			>
				<header style={{ display: "flex", width: "100%" }}>
					<CustomButton
						slot="previous"
						className={style.searchIconButton}
						type="submit"
						dangerouslySetInnerHTML={{ __html: arrow_left }}
					/>
					<Heading
						style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
					/>
					<CustomButton
						slot="next"
						className={style.searchIconButton}
						type="submit"
						dangerouslySetInnerHTML={{ __html: arrow_right }}
					/>
				</header>
				<div style={{ display: "flex", gap: 30, overflow: "auto" }}>
					<CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
					<CalendarGrid offset={{ months: 1 }}>
						{(date) => <CalendarCell date={date} />}
					</CalendarGrid>
					<CalendarGrid offset={{ months: 2 }}>
						{(date) => <CalendarCell date={date} />}
					</CalendarGrid>
				</div>
			</Calendar>
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
