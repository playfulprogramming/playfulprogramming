import { describe, expect, test } from "vitest";
import {
	formatCompactTime,
	formatDate,
	formatEnglishOrdinalDate,
	toDate,
} from "./date.ts";

describe("formatEnglishOrdinalDate", () => {
	test.each([
		[1, "Jun 1st, 2023"],
		[2, "Jun 2nd, 2023"],
		[3, "Jun 3rd, 2023"],
		[4, "Jun 4th, 2023"],
		[11, "Jun 11th, 2023"],
		[12, "Jun 12th, 2023"],
		[13, "Jun 13th, 2023"],
		[21, "Jun 21st, 2023"],
		[22, "Jun 22nd, 2023"],
		[23, "Jun 23rd, 2023"],
	])("formats the %i day", (day, expected) => {
		expect(
			formatEnglishOrdinalDate(new Date(2023, 5, day, 12), {
				month: "short",
				day: "numeric",
				year: "numeric",
			}),
		).toBe(expected);
	});
});

test("interprets ISO date-only strings in the local time zone", () => {
	const date = toDate("2026-01-18");

	expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
		2026, 0, 18,
	]);
	expect(
		formatDate("2026-01-18", {
			month: "long",
			day: "numeric",
			year: "numeric",
		}),
	).toBe("January 18, 2026");
});

test("preserves years below 100 in ISO date-only strings", () => {
	const date = toDate("0099-01-18");

	expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
		99, 0, 18,
	]);
});

test("formats compact event times without a day-period separator", () => {
	expect(formatCompactTime(new Date(2026, 3, 2, 18, 5))).toBe("6:05PM");
});
