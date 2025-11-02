import {
	ButtonContext,
	ButtonProps,
	Calendar as AriaCalendar,
	CalendarCell,
	CalendarGrid,
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

export function Calendar() {
	return (
		<AriaCalendar
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
		</AriaCalendar>
	);
}
