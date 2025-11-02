import {
	ButtonContext,
	ButtonProps,
	Calendar as AriaCalendar,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarGridProps,
	CalendarHeaderCell,
	Heading,
	useContextProps,
	CalendarState,
	CalendarCellProps,
	CalendarStateContext,
	RangeCalendarStateContext,
	useRenderProps,
} from "react-aria-components";
import arrow_left from "../../../../icons/arrow_left.svg?raw";
import arrow_right from "../../../../icons/arrow_right.svg?raw";
import { ForwardedRef, forwardRef } from "preact/compat";
import {
	mergeProps,
	useButton,
	useCalendarCell,
	useFocusRing,
	useHover,
} from "react-aria";
import { IconOnlyButton } from "components/button/button";
import style from "./calendar.module.scss";
import { useWindowSize } from "../../../../hooks/use-window-size";
import { tabletLarge, tabletSmall } from "../../../../tokens/breakpoints";
import { useContext, useMemo, useRef } from "preact/hooks";
import { CalendarDate, isToday } from "@internationalized/date";
import { filterDOMProps } from "@react-aria/utils";
// @ts-expect-error This is brittle and stupid and dumb
import { hookData } from "@react-aria/calendar/dist/utils.mjs";

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

// TODO: Custom fork of the CalendarCell component from react-aria-components to
// 	overwrite functionality for `value` to enable multiple dates being selected
export const CustomCalendarCell = forwardRef(function CustomCalendarCell(
	{ date, ...otherProps }: CalendarCellProps,
	ref: ForwardedRef<HTMLTableCellElement>,
) {
	const baseState: CalendarState = useContext(CalendarStateContext);
	const state: CalendarState = useMemo(
		() => ({
			...baseState,
			isSelected(date: CalendarDate): boolean {
				return true;
			},
		}),
		[baseState],
	);
	hookData.set(state, {});
	const isOutsideMonth = false;
	const istoday = isToday(date, state.timeZone);

	const buttonRef = useRef<HTMLDivElement>(null);
	const { cellProps, buttonProps, ...states } = useCalendarCell(
		{ date, isOutsideMonth },
		state,
		buttonRef,
	);

	const { hoverProps, isHovered } = useHover({
		...otherProps,
		isDisabled: states.isDisabled,
	});
	let { focusProps, isFocusVisible } = useFocusRing();
	isFocusVisible &&= states.isFocused;

	const renderProps = useRenderProps({
		...otherProps,
		defaultChildren: states.formattedDate,
		defaultClassName: "react-aria-CalendarCell",
		values: {
			date,
			isHovered,
			isOutsideMonth,
			isFocusVisible,
			isSelectionStart: false,
			isSelectionEnd: false,
			isToday: istoday,
			...states,
		},
	});

	const dataAttrs = {
		"data-focused": states.isFocused || undefined,
		"data-hovered": isHovered || undefined,
		"data-pressed": states.isPressed || undefined,
		"data-unavailable": states.isUnavailable || undefined,
		"data-disabled": states.isDisabled || undefined,
		"data-focus-visible": isFocusVisible || undefined,
		"data-outside-visible-range": states.isOutsideVisibleRange || undefined,
		"data-outside-month": isOutsideMonth || undefined,
		"data-selected": states.isSelected || undefined,
		"data-selection-start": undefined,
		"data-selection-end": undefined,
		"data-invalid": states.isInvalid || undefined,
		"data-today": istoday || undefined,
	};

	const DOMProps = filterDOMProps(otherProps as never, { global: true });

	return (
		<td {...cellProps} ref={ref}>
			<div
				{...(mergeProps(
					DOMProps,
					buttonProps,
					focusProps,
					hoverProps,
					dataAttrs,
					renderProps,
				) as unknown as Record<string, never>)}
				ref={buttonRef}
			/>
		</td>
	);
});

function CustomCalendarCellWrapper(props: CalendarCellProps) {
	return (
		<CustomCalendarCell {...props} className={style.calendarCell}>
			{({ formattedDate }) => (
				<span className={style.innerCalendarCell}>{formattedDate}</span>
			)}
		</CustomCalendarCell>
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
				{(date) => <CustomCalendarCellWrapper date={date} />}
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
