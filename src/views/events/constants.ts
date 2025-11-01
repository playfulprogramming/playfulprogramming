import { Event, EventBlock } from "./types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const bookClubBlocks = [
	{
		slug: "book-club-11-06-2025",
		starts_at: dayjs
			.tz("11-06-2025 07:30 PM", "MM-DD-YYYY hh:mm A", "America/Los_Angeles")
			.toDate(),
		ends_at: dayjs
			.tz("11-06-2025 08:30 PM", "MM-DD-YYYY hh:mm A", "America/Los_Angeles")
			.toDate(),
		location_description: "Dithering Part 1 — Introduction",
		location_url: "https://visualrambling.space/dithering-part-1/",
		presenters: [],
	},
] satisfies EventBlock[];

export const events = [
	{
		slug: "book-club",
		title: "Book Club",
		description:
			"In our book club, every Thursday we hang out and chat about a topic or a specific article!",
		location_description: "Join our Discord",
		location_url: "https://discord.gg/FMcvc6T",
		blocks: bookClubBlocks,
		organizers: [],
		in_person: false,
	},
] satisfies Event[];
