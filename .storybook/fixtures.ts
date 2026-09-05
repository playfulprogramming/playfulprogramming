import type { PersonInfo } from "#types/PersonInfo.ts";
import type { CollectionInfo } from "#types/CollectionInfo.ts";
import type { PostInfoWithBanner } from "#components/post-card/types.ts";
import type { SnitipInfo } from "#types/SnitipInfo.ts";
import type { FileEntry } from "#components/code-embed/types.ts";
import type {
	DirectoryProps,
	FileProps,
} from "#components/file-list/file-list.tsx";

export const unicornImage = "/unicorn_happy.svg";
export const illustration = "/illustrations/illustration-community.svg";
export const imageMeta = {
	relativePath: unicornImage,
	relativeServerPath: unicornImage,
	absoluteFSPath: "",
	width: 512,
	height: 512,
};
export const person = {
	kind: "person",
	id: "storybook-author",
	file: "",
	name: "Alex Example",
	firstName: "Alex",
	lastName: "Example",
	description:
		"A developer who loves making programming approachable, one small example at a time.",
	socials: {},
	pronouns: "they/them",
	profileImg: unicornImage,
	profileImgMeta: imageMeta,
	color: "#9562ff",
	roles: [],
	achievements: [],
	boardRoles: [],
	locale: "en",
	locales: ["en"],
	totalPostCount: 12,
	totalWordCount: 24000,
} satisfies PersonInfo;
export const post = {
	kind: "post",
	slug: "storybook-post",
	file: "",
	title: "Learning components through small examples",
	description:
		"Build a reusable component and explore the decisions behind its API.",
	excerpt: "Start small, experiment, and learn together.",
	authors: [person.id],
	tags: ["javascript", "accessibility"],
	published: "2026-01-15",
	publishedMeta: "January 15, 2026",
	path: "/posts/storybook-post",
	locale: "en",
	locales: ["en"],
	wordCount: 1800,
	banner: illustration,
} satisfies PostInfoWithBanner;
export const collection = {
	kind: "collection",
	slug: "storybook-collection",
	file: "",
	title: "A playful guide to components",
	description:
		"Learn to build accessible interfaces with examples you can try.",
	authors: [person.id],
	tags: ["javascript"],
	coverImg: unicornImage,
	coverImgMeta: imageMeta,
	published: "2026-01-15",
	locale: "en",
	locales: ["en"],
	postCount: 8,
} satisfies CollectionInfo;
export const snitip = {
	id: "storybook-snitip",
	title: "What is a component?",
	content:
		"<p>A component groups markup, styles, and behavior into a reusable piece of an interface.</p>",
	links: [
		{
			name: "Explore components",
			href: "https://playfulprogramming.com/search",
		},
	],
	tags: [],
	tagsMeta: new Map(),
} satisfies SnitipInfo;
export const entries: FileEntry[] = [
	{
		name: "src/main.ts",
		filetype: "ts",
		code: 'console.log("Hello, world!");',
	},
	{
		name: "src/styles.css",
		filetype: "css",
		code: "body { color: rebeccapurple; }",
	},
	{ name: "README.md", filetype: "md", code: "# A small example" },
];
export const file = {
	name: "main.ts",
	filetype: "ts",
	isDirectory: false,
	isPlaceholder: false,
	isHighlighted: false,
} satisfies FileProps;
export const files: (DirectoryProps | FileProps)[] = [
	{
		name: "src",
		isDirectory: true,
		openByDefault: true,
		isHighlighted: false,
		items: [
			file,
			{ ...file, name: "styles.css", filetype: "css", isHighlighted: true },
		],
	},
	{ ...file, name: "README.md", filetype: "md" },
];
export const quizOptions = [
	{ id: "button", label: "A button", isCorrect: true },
	{ id: "div", label: "A div with a click handler" },
];
export const tabs = [
	{ slug: "overview", name: "Overview" },
	{ slug: "example", name: "Example" },
];
