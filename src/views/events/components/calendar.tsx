import {
	ButtonContext,
	ButtonProps,
	Calendar as AriaCalendar,
	CalendarCell,
	CalendarCellProps,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarGridProps,
	CalendarHeaderCell,
	CalendarHeaderCellProps,
	Heading,
	useContextProps,
} from "react-aria-components";
import arrow_left from "../../../icons/arrow_left.svg?raw";
import arrow_right from "../../../icons/arrow_right.svg?raw";
import { ForwardedRef, forwardRef } from "preact/compat";
import { useButton } from "react-aria";
import { IconOnlyButton } from "components/button/button";
import style from "./calendar.module.scss";

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

function CustomCalendarCell(props: CalendarCellProps) {
	return (
		<CalendarCell {...props}>
			{({ formattedDate }) => (
				<span className={style.calendarCell}>
					<span className={style.innerCalendarCell}>{formattedDate}</span>
				</span>
			)}
		</CalendarCell>
	);
}

function CustomCalendarGrid(props: CalendarGridProps) {
	return (
		<CalendarGrid {...props} className={style.grid}>
			<CalendarGridHeader>
				{(day) => (
					<CalendarHeaderCell className={style.calendarCell}>
						<span className={style.innerCalendarCell}>{day}</span>
					</CalendarHeaderCell>
				)}
			</CalendarGridHeader>
			<CalendarGridBody>
				{(date) => <CustomCalendarCell date={date} />}
			</CalendarGridBody>
		</CalendarGrid>
	);
}

export function Calendar() {
	return (
		<AriaCalendar
			className={style.calendar}
			aria-label="Events calendar"
			visibleDuration={{ months: 3 }}
		>
			<header className={style.calendarHeader}>
				<CustomButton
					slot="previous"
					className={style.arrowButton}
					type="submit"
					dangerouslySetInnerHTML={{ __html: arrow_left }}
				/>
				<Heading className={style.calendarHeading} />
				<CustomButton
					slot="next"
					className={style.arrowButton}
					type="submit"
					dangerouslySetInnerHTML={{ __html: arrow_right }}
				/>
			</header>
			<div className={style.gridContainer}>
				<CustomCalendarGrid />
				<CustomCalendarGrid offset={{ months: 1 }} />
				<CustomCalendarGrid offset={{ months: 2 }} />
			</div>
		</AriaCalendar>
	);
}
