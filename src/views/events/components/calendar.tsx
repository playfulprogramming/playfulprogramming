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
	Heading,
	useContextProps,
} from "react-aria-components";
import arrow_left from "../../../icons/arrow_left.svg?raw";
import arrow_right from "../../../icons/arrow_right.svg?raw";
import { ForwardedRef, forwardRef } from "preact/compat";
import { useButton } from "react-aria";
import { IconOnlyButton } from "components/button/button";
import style from "./calendar.module.scss";
import { useWindowSize } from "../../../hooks/use-window-size";
import { mobile, tabletLarge, tabletSmall } from "../../../tokens/breakpoints";
import { useMemo } from "preact/hooks";

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
		<CalendarCell {...props} className={style.calendarCell}>
			{({ formattedDate }) => (
				<span className={style.innerCalendarCell}>{formattedDate}</span>
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
	const windowSize = useWindowSize();

	const isMobile = windowSize.width <= tabletSmall;
	const isTablet = windowSize.width <= tabletLarge;

	const visibleDuration = useMemo(() => {
		if (isMobile) {
			return { months: 1 };
		}
		if (isTablet) {
			return { months: 2 };
		}
		return { months: 3 };
	}, [isMobile, isTablet]);

	return (
		<AriaCalendar
			className={style.calendar}
			aria-label="Events calendar"
			visibleDuration={visibleDuration}
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
				{isMobile ? null : <CustomCalendarGrid offset={{ months: 1 }} />}
				{isTablet ? null : <CustomCalendarGrid offset={{ months: 2 }} />}
			</div>
		</AriaCalendar>
	);
}
