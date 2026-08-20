import location from "#src/icons/location.svg?raw";
import wifi from "#src/icons/wifi.svg?raw";
import repeat from "#src/icons/repeat.svg?raw";
import style from "./event-chip.module.scss";

interface BaseEventChipProps {
	// With icon or without
	size: "default" | "compact";
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

export function EventChip(props: EventChipProps) {
	let icon: string;
	let borderColor: string;
	let color: string;
	let background: string;
	let label: string;

	switch (props.variant) {
		case "in-person": {
			icon = location;
			background = "var(--tint_positive_low)";
			borderColor = "var(--positive_low)";
			color = "var(--positive_on-low)";
			label = "In-person";
			break;
		}
		case "recurring": {
			icon = repeat;
			background = "var(--tint_secondary_low)";
			borderColor = "var(--secondary_low)";
			color = "var(--secondary_on-low)";
			label = `Every ${props.every}`;
			break;
		}
		case "online":
		default: {
			icon = wifi;
			background = "var(--tint_primary_low)";
			borderColor = "var(--primary_low)";
			color = "var(--primary_on-low)";
			label = "Online";
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
