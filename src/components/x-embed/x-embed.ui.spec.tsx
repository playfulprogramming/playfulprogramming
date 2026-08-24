import { expect, test } from "#src/ui-test-utils/index.ts";
import { render } from "@testing-library/preact";
import { createTranslator } from "#utils/translations.ts";
import { formatPostDate, XEmbedPlaceholder } from "./x-embed.tsx";

test("uses locale plural rules for English ordinal days", () => {
	const translate = createTranslator("en");
	const cases = [
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
	] as const;

	for (const [day, expected] of cases) {
		expect(formatPostDate(new Date(2023, 5, day, 12), "en", translate)).toBe(
			expected,
		);
	}
});

test("preserves native date formatting for non-English locales", () => {
	const date = new Date(2023, 5, 28, 12);
	const locales = ["es", "fr", "pt", "pt-br", "bn"] as const;

	for (const locale of locales) {
		const expected = new Intl.DateTimeFormat(locale, {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);

		expect(formatPostDate(date, locale, createTranslator(locale))).toBe(
			expected,
		);
	}
});

test("keeps the ordinal day suffix in English post dates", () => {
	const { getByText } = render(
		<XEmbedPlaceholder
			locale="en"
			text="Post text"
			profilePic="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
			date="2023-06-28T12:00:00"
			handle="playful_program"
			name="Playful Programming"
			link="https://x.com/playful_program/status/1"
		/>,
	);

	expect(getByText("Jun 28th, 2023")).toBeInTheDocument();
});
