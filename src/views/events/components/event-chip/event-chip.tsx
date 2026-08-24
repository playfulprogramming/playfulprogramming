import location from "#src/icons/location.svg?raw";
import wifi from "#src/icons/wifi.svg?raw";
import repeat from "#src/icons/repeat.svg?raw";
import style from "./event-chip.module.scss";
import type { Translate, TranslationKey } from "#utils/translations.ts";

interface BaseEventChipProps {
	// With icon or without
	size: "default" | "compact";
	translate: Translate;
}

interface InPersonChipProps extends BaseEventChipProps {
	variant: "in-person";
}

interface OnlineChipProps extends BaseEventChipProps {
	variant: "online";
}

interface RecurringChipProps extends BaseEventChipProps {
	variant: "recurring";
	every: "day" | "week" | "month" | "year";
}

type EventChipProps = InPersonChipProps | OnlineChipProps | RecurringChipProps;

const recurrenceKeys: Record<RecurringChipProps["every"], TranslationKey> = {
	day: "events.recurrence.day",
	week: "events.recurrence.week",
	month: "events.recurrence.month",
	year: "events.recurrence.year",
};

export function EventChip(props: EventChipProps) {
	let icon: string;
	let borderColor: string;
	let color: string;
	let background: string;
	let label: string;

	switch (props.variant) {
		case "in-person": {
			icon = location;
			background = "var(--surface_positive_emphasis-low)";
			borderColor = "var(--positive_variant)";
			color = "var(--positive_on-variant)";
			label = props.translate("events.type.in_person");
			break;
		}
		case "recurring": {
			icon = repeat;
			background = "var(--surface_secondary_emphasis-low)";
			borderColor = "var(--secondary_variant)";
			color = "var(--secondary_on-variant)";
			label = props.translate(recurrenceKeys[props.every]);
			break;
		}
		case "online":
		default: {
			icon = wifi;
			background = "var(--surface_primary_emphasis-low)";
			borderColor = "var(--primary_variant)";
			color = "var(--primary_on-variant)";
			label = props.translate("events.type.online");
			break;
		}
	}

	return (
		<span
			style={{
				borderColor,
				background,
				color,
			}}
			className={style.container}
		>
			{props.size === "default" ? (
				<span
					className={style.icon}
					dangerouslySetInnerHTML={{ __html: icon }}
				/>
			) : null}
			<span
				className={
					props.size === "default"
						? `text-style-button-regular ${style.defaultVariantLabel}`
						: // TODO: This should be a new text style for `text-style-button-small`?
							"text-style-button-regular"
				}
			>
				{label}
			</span>
		</span>
	);
}
