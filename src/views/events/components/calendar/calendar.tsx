import {
	type ButtonProps,
	type CalendarGridProps,
	type CalendarState,
	type CalendarCellProps,
	type CalendarCellRenderProps,
	ButtonContext,
	Calendar as AriaCalendar,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
	useContextProps,
	CalendarStateContext,
	useRenderProps,
} from "react-aria-components";
import arrow_left from "../../../../icons/arrow_left.svg?raw";
import arrow_right from "../../../../icons/arrow_right.svg?raw";
import { type ForwardedRef, forwardRef } from "preact/compat";
import {
	DismissButton,
	mergeProps,
	Overlay,
	useButton,
	useCalendarCell,
	useDialog,
	useFocusRing,
	useFocusVisible,
	useHover,
	useOverlayTrigger,
	usePopover,
} from "react-aria";
import { IconOnlyButton } from "#components/button/button.tsx";
import style from "./calendar.module.scss";
import { useWindowSize } from "../../../../hooks/use-window-size.tsx";
import { tabletLarge, tabletSmall } from "../../../../tokens/breakpoints.ts";
import { type MutableRef, useContext, useMemo, useRef } from "preact/hooks";
import {
	type CalendarDate,
	fromDate,
	getLocalTimeZone,
	isSameMonth,
	isToday,
	parseDate,
	today,
} from "@internationalized/date";
import { filterDOMProps } from "@react-aria/utils";
import type { Event } from "../../types.ts";
import dayjs from "dayjs";
import { useIsOnClient } from "../../../../hooks/use-is-on-client.ts";
import { useReactAriaScrollGutterHack } from "../../../../hooks/useReactAriaScrollGutterHack.ts";
import {
	type OverlayTriggerState,
	useOverlayTriggerState,
} from "react-stately";
import type { DOMProps } from "@react-types/shared";
import author from "#src/icons/authors.svg?raw";
import wifi from "#src/icons/wifi.svg?raw";

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

interface CustomCalendarCellProps extends CalendarCellProps {
	// It's a long story
	monthDate: Date;
	popupTriggerButtonProps: DOMProps;
}

// This mirrors CalendarCell so popup trigger props can be merged into the interactive element.
export const CustomCalendarCell = forwardRef(
	(
		{
			date,
			monthDate,
			popupTriggerButtonProps,
			...otherProps
		}: CustomCalendarCellProps,
		ref: ForwardedRef<HTMLTableCellElement>,
	) => {
		const state: CalendarState = useContext(CalendarStateContext);

		const isOutsideMonth = !isSameMonth(
			date,
			fromDate(monthDate, state.timeZone),
		);
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
		// eslint-disable-next-line prefer-const
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
						hoverProps,
						dataAttrs,
						renderProps,
						focusProps,
						states.isSelected ? popupTriggerButtonProps : {},
					) as unknown as Record<string, never>)}
					ref={buttonRef}
				/>
			</td>
		);
	},
);

interface CalendarDayPopupProps {
	date: CalendarDate;
	eventsForDate: Event[];
	triggerRef: MutableRef<HTMLElement | null>;
	triggerState: OverlayTriggerState;
	overlayProps: DOMProps;
}

function CalendarDayPopup({
	eventsForDate,
	triggerRef,
	triggerState,
	overlayProps,
	date,
}: CalendarDayPopupProps) {
	const state: CalendarState = useContext(CalendarStateContext);

	/* Setup popover */
	const popoverRef = useRef<HTMLDivElement>(null);
	const { popoverProps, underlayProps, arrowProps, placement } = usePopover(
		{
			shouldFlip: true,
			offset: 32 - 14 / 2,
			popoverRef,
			triggerRef,
		},
		triggerState,
	);

	/* Setup dialog */
	const dialogRef = useRef(null);
	const { dialogProps, titleProps } = useDialog(overlayProps, dialogRef);
	const { isFocusVisible } = useFocusVisible();

	// bandaid solution for layout shift
	useReactAriaScrollGutterHack();

	return (
		<Overlay>
			<div {...underlayProps} className={style.underlay} />

			<div {...popoverProps} ref={popoverRef} className={style.popup}>
				<svg
					width="24"
					height="14"
					viewBox="0 0 24 14"
					fill="none"
					{...arrowProps}
					className={style.arrow}
					data-placement={placement}
				>
					<path
						d="M9.6 12.8L0 0H24L14.4 12.8C13.2 14.4 10.8 14.4 9.6 12.8Z"
						fill="var(--calendar-popup_background-color)"
					/>
					<path
						d="M2.5 2.08616e-06L11.2 11.6C11.6 12.1333 12.4 12.1333 12.8 11.6L21.5 2.08616e-06L24 0L14.4 12.8C13.2 14.4 10.8 14.4 9.6 12.8L0 2.08616e-06H2.5Z"
						fill="var(--calendar-popup_border-color)"
					/>
				</svg>
				<DismissButton onDismiss={triggerState.close} />
				<div
					{...dialogProps}
					ref={dialogRef}
					class={style.popupDialog}
					data-focus-visible={isFocusVisible}
				>
					<h1 {...titleProps} className="visually-hidden">
						Events on this day
					</h1>
					<div className={style.popupContents}>
						<ul role={"list"} className={style.popupContentContainer}>
							{eventsForDate.map((event) => {
								const firstBlockOfDay = event.blocks.find((block) => {
									return dayjs(date.toDate(state.timeZone)).isSame(
										block.starts_at,
										"date",
									);
								});

								// How?
								if (!firstBlockOfDay) return null;

								return (
									<li key={event.slug}>
										<a
											href={
												event.has_event_page
													? `/events/${event.slug}`
													: undefined
											}
											className={style.popupContentLineContainer}
										>
											<span className={style.popupContentLine}>
												<span
													className={`text-style-body-small ${style.popupContentTime}`}
												>
													{dayjs(firstBlockOfDay.starts_at).format(
														"hh:mm A",
													)}{" "}
												</span>
												<span className={`text-style-body-small-bold`}>
													{event.title}
												</span>
											</span>
											<span
												className={style.popupContentLineIcon}
												dangerouslySetInnerHTML={{
													__html: event.in_person ? author : wifi,
												}}
											/>
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
				<DismissButton onDismiss={triggerState.close} />
			</div>
		</Overlay>
	);
}

interface CustomCalendarCellWrapperProps extends CalendarCellProps {
	events: Event[];
	monthDate: Date;
}

function CustomCalendarCellWrapper({
	events,
	monthDate,
	date,
	...props
}: CustomCalendarCellWrapperProps) {
	const triggerRef = useRef(null);
	const triggerState = useOverlayTriggerState({});
	const { triggerProps, overlayProps } = useOverlayTrigger(
		{ type: "dialog" },
		triggerState,
		triggerRef,
	);

	const { buttonProps } = useButton(triggerProps, triggerRef);

	const state: CalendarState = useContext(CalendarStateContext);

	const eventsForDate = useMemo(() => {
		return events.filter((event) =>
			event.blocks.some((block) =>
				dayjs(date.toDate(state.timeZone)).isSame(block.starts_at, "date"),
			),
		);
	}, [events, state, date]);

	return (
		<CustomCalendarCell
			{...props}
			date={date}
			popupTriggerButtonProps={buttonProps}
			ref={triggerRef}
			monthDate={monthDate}
			className={style.calendarCell}
		>
			{({ formattedDate, isSelected, date }: CalendarCellRenderProps) => {
				const classes = [style.innerCalendarCell];
				if (isSelected) {
					classes.push(`text-style-body-small-bold`);
				} else {
					classes.push(`text-style-body-small`);
				}

				return (
					<>
						<span className={classes.join(" ")}>{formattedDate}</span>
						{triggerState.isOpen && (
							<CalendarDayPopup
								date={date}
								triggerState={triggerState}
								overlayProps={overlayProps}
								eventsForDate={eventsForDate}
								triggerRef={triggerRef}
							/>
						)}
					</>
				);
			}}
		</CustomCalendarCell>
	);
}

interface CustomCalendarGridProps extends CalendarGridProps {
	events: Event[];
}

function CustomCalendarGrid({ events, ...props }: CustomCalendarGridProps) {
	const state: CalendarState = useContext(CalendarStateContext);

	const monthDate = dayjs(state.visibleRange.start.toDate(state.timeZone))
		.startOf("month")
		.add(props.offset?.months ?? 0, "month")
		.toDate();

	return (
		<CalendarGrid {...props} className={style.grid}>
			<CalendarGridHeader>
				{(day: CalendarDate) => (
					<CalendarHeaderCell className={`text-style-body-small-bold`}>
						<div className={`${style.calendarCell}`}>
							<span className={style.innerCalendarCell}>{day}</span>
						</div>
					</CalendarHeaderCell>
				)}
			</CalendarGridHeader>
			<CalendarGridBody>
				{(date: CalendarDate) => (
					<CustomCalendarCellWrapper
						monthDate={monthDate}
						events={events}
						date={date}
					/>
				)}
			</CalendarGridBody>
		</CalendarGrid>
	);
}

function CustomHeading() {
	const state: CalendarState = useContext(CalendarStateContext);

	const firstMonthName = useMemo(
		() => dayjs(state.visibleRange.start.toDate(state.timeZone)).format("MMMM"),
		[state],
	);
	const lastMonthName = useMemo(
		() => dayjs(state.visibleRange.end.toDate(state.timeZone)).format("MMMM"),
		[state],
	);
	const lastYearName = useMemo(
		() => dayjs(state.visibleRange.end.toDate(state.timeZone)).format("YYYY"),
		[state],
	);

	const shouldShowSecondMonth = useMemo(
		() => !isSameMonth(state.visibleRange.start, state.visibleRange.end),
		[state],
	);

	return (
		<h2
			aria-hidden={true}
			className={`_text-style-headline-6 ${style.calendarHeading}`}
		>
			{firstMonthName}{" "}
			{shouldShowSecondMonth ? (
				<>
					<span className={style.calendarHeadingDisabled}> to </span>{" "}
					{lastMonthName}
				</>
			) : null}
			<span className={style.calendarHeadingDisabled}> {lastYearName}</span>
		</h2>
	);
}

interface CalendarProps {
	events: Event[];
}

export function Calendar({ events }: CalendarProps) {
	const isClient = useIsOnClient();

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

	const selectedEventDates = useMemo(() => {
		const selectedDates = new Map<string, CalendarDate>();

		for (const event of events) {
			for (const block of event.blocks) {
				const dateString = dayjs(block.starts_at).format("YYYY-MM-DD");
				selectedDates.set(dateString, parseDate(dateString));
			}
		}

		return [...selectedDates.values()];
	}, [events]);

	// If we do an SSR pass on this component, the timezone may mismatch the client,
	// and as a result, cause SSR errors and therefore break many assumptions about
	// how the calendar should work.
	if (!isClient) return null;

	return (
		<AriaCalendar
			className={style.calendar}
			aria-label="Events calendar"
			visibleDuration={visibleDuration}
			selectionMode="multiple"
			value={selectedEventDates}
			defaultFocusedValue={today(getLocalTimeZone())}
			isReadOnly
		>
			<header className={style.calendarHeader}>
				<CustomButton
					slot="previous"
					className={style.arrowButton}
					type="submit"
					dangerouslySetInnerHTML={{ __html: arrow_left }}
				/>
				<CustomHeading />
				<CustomButton
					slot="next"
					className={style.arrowButton}
					type="submit"
					dangerouslySetInnerHTML={{ __html: arrow_right }}
				/>
			</header>
			<div className={style.gridContainer}>
				<CustomCalendarGrid events={events} />
				{isMobile ? null : (
					<CustomCalendarGrid events={events} offset={{ months: 1 }} />
				)}
				{isTablet ? null : (
					<CustomCalendarGrid events={events} offset={{ months: 2 }} />
				)}
			</div>
		</AriaCalendar>
	);
}
