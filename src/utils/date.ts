type DateInput = Date | number | string;

const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

const englishOrdinalSuffixes = {
	zero: "th",
	one: "st",
	two: "nd",
	few: "rd",
	many: "th",
	other: "th",
} as const satisfies Record<Intl.LDMLPluralRule, string>;

const englishOrdinalRules = new Intl.PluralRules("en-US", {
	type: "ordinal",
});

/**
 * Converts a date-like value to a Date. ISO date-only strings are interpreted in
 * the local time zone, matching the behavior of the date metadata they represent.
 */
export function toDate(value: DateInput): Date {
	if (value instanceof Date || typeof value === "number") {
		return new Date(value);
	}

	const isoDate = isoDatePattern.exec(value);
	if (isoDate) {
		const [, year, month, day] = isoDate;
		const date = new Date(0);
		date.setFullYear(Number(year), Number(month) - 1, Number(day));
		date.setHours(0, 0, 0, 0);
		return date;
	}

	return new Date(value);
}

export function formatDate(
	value: DateInput,
	options: Intl.DateTimeFormatOptions,
) {
	return new Intl.DateTimeFormat("en-US", options).format(toDate(value));
}

/**
 * Formats an English date and adds the locale's ordinal suffix to its day part.
 */
export function formatEnglishOrdinalDate(
	value: DateInput,
	options: Intl.DateTimeFormatOptions,
) {
	const date = toDate(value);
	const formatter = new Intl.DateTimeFormat("en-US", options);
	const parts = formatter.formatToParts(date);
	const day = parts.find((part) => part.type === "day");

	if (!day) return formatter.format(date);

	const ordinalRule = englishOrdinalRules.select(Number(day.value));
	return parts
		.map((part) =>
			part.type === "day"
				? `${part.value}${englishOrdinalSuffixes[ordinalRule]}`
				: part.value,
		)
		.join("");
}

/** Formats the compact English time used by event cards (for example, 2:30PM). */
export function formatCompactTime(value: DateInput) {
	const parts = new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
	}).formatToParts(toDate(value));

	return parts
		.filter(
			(part, index) =>
				part.type !== "literal" || parts[index + 1]?.type !== "dayPeriod",
		)
		.map((part) => part.value)
		.join("");
}
