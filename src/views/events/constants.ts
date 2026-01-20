import { Event, EventBlock } from "./types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const bookClubBlocks = [
	{
		slug: "book-club-09-25-2025",
		starts_at: dayjs("09-25-2025 02:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("09-25-2025 03:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "The Perils of Reactivity",
		location_url:
			"https://outbox.matthewphillips.info/archive/perils-of-reactivity",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-10-23-2025",
		starts_at: dayjs("10-23-2025 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("10-23-2025 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "Build Your Own Database",
		location_url: "https://www.nan.fyi/database",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-10-30-2025",
		starts_at: dayjs("10-30-2025 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("10-30-2025 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "An Interactive Guide to TanStack DB",
		location_url: "https://frontendatscale.com/blog/tanstack-db/",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-11-06-2025",
		starts_at: dayjs("11-06-2025 07:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("11-06-2025 08:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "Dithering Part 1 — Introduction",
		location_url: "https://visualrambling.space/dithering-part-1/",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-11-20-2025",
		starts_at: dayjs("11-20-2025 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("11-20-2025 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "A pragmatic guide to modern CSS colours - part one",
		location_url:
			"https://piccalil.li/blog/a-pragmatic-guide-to-modern-css-colours-part-one/",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-11-27-2025",
		starts_at: dayjs("11-27-2025 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("11-27-2025 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description:
			"Unpacking Cloudflare Workers CPU Performance Benchmarks",
		location_url:
			"https://blog.cloudflare.com/unpacking-cloudflare-workers-cpu-performance-benchmarks/",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-12-04-2025",
		starts_at: dayjs("12-04-2025 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("12-04-2025 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "Your URL Is Your State",
		location_url: "https://alfy.blog/2025/10/31/your-url-is-your-state.html",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-01-14-2026",
		starts_at: dayjs("01-14-2026 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("01-14-2026 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "MSW: Docs",
		location_url: "https://mswjs.io/docs/",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-01-21-2026",
		starts_at: dayjs("01-21-2026 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("01-21-2026 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "How to Steal Any React Component",
		location_url: "https://fant.io/react/",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-01-28-2026",
		starts_at: dayjs("01-28-2026 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("01-28-2026 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: 'The "You" in CPU: The Basics',
		location_url: "https://cpu.land/the-basics",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-02-04-2026",
		starts_at: dayjs("02-04-2026 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("02-04-2026 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: 'The "You" in CPU: Multitasking',
		location_url: "https://cpu.land/slice-dat-time",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-02-11-2026",
		starts_at: dayjs("02-11-2026 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("02-11-2026 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: 'The "You" in CPU: Exec',
		location_url: "https://cpu.land/how-to-run-a-program",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-02-18-2026",
		starts_at: dayjs("02-18-2026 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("02-18-2026 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: 'The "You" in CPU: Elf',
		location_url: "https://cpu.land/becoming-an-elf-lord",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-02-25-2026",
		starts_at: dayjs("02-25-2026 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("02-25-2026 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: 'The "You" in CPU: Paging',
		location_url: "https://cpu.land/the-translator-in-your-computer",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
	{
		slug: "book-club-03-03-2026",
		starts_at: dayjs("03-03-2026 04:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("03-03-2026 05:30 PM", "MM-DD-YYYY hh:mm A")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: 'The "You" in CPU: Fork-Exec',
		location_url: "https://cpu.land/lets-talk-about-forks-and-cows",
		presenters: [],
		timezone: "America/Los_Angeles",
	},
] satisfies EventBlock[];

export const SacramentoBootcampBlocks = [
	{
		slug: "sacramento-bootcamp-2026-01",
		starts_at: dayjs("01-06-2026", "MM-DD-YYYY")
			.tz("America/Los_Angeles", true)
			.toDate(),
		ends_at: dayjs("03-24-2026", "MM-DD-YYYY")
			.tz("America/Los_Angeles", true)
			.toDate(),
		location_description: "Sacramento, CA",
		timezone: "America/Los_Angeles",
		presenters: [],
	},
] satisfies EventBlock[];

export const events = [
	{
		slug: "book-club",
		title: "Book Club",
		description:
			"In our book club, every Wednesday we hang out and chat about a topic or a specific article!",
		location_description: "Join our Discord",
		location_url: "https://discord.gg/FMcvc6T",
		blocks: bookClubBlocks,
		organizers: [],
		in_person: false,
		is_online: true,
		is_recurring: true,
	},
	{
		slug: "sacramento-bootcamp",
		title: "Playful Bootcamp",
		description:
			"We are excited to announce our free Web Development Bootcamp!\n" +
			"Beginning in January 2026. Our mission is to empower adult learners with the fundamentals of modern frontend web development. In this 12 week course, we’ll cover HTML, CSS, JavaScript, and React! Taking this course will provide you with both technical knowledge and hands-on practice and prepare you to contribute to real teams and projects!",
		location_description: "",
		location_url: "",
		blocks: SacramentoBootcampBlocks,
		organizers: [],
		in_person: true,
		is_online: true,
		is_recurring: false,
	},
] satisfies Event[];
