import { Type } from "typebox";

const CollectionButtonSchema = Type.Object(
	{
		text: Type.String(),
		url: Type.String(),
	},
	{
		additionalProperties: false,
		examples: [
			{
				text: "Learn More",
				url: "https://example.com/learn-more",
			},
		],
	},
);

const CollectionCurrentPost = Type.Object(
	{
		post: Type.String(),
	},
	{
		additionalProperties: false,
		examples: [
			{
				post: "abc123",
			},
		],
	},
);

const CollectionFuturePost = Type.Object(
	{
		order: Type.Number(),
		title: Type.String(),
		description: Type.String({ default: "" }),
	},
	{
		additionalProperties: false,
		examples: [
			{
				order: 1,
				title: "Chapter One",
				description: "An introduction to chapter one.",
			},
		],
	},
);

export const CollectionInfoSchema = Type.Object(
	{
		title: Type.String(),
		description: Type.String({ default: "" }),
		authors: Type.Optional(Type.Array(Type.String())),
		coverImg: Type.String(),
		socialImg: Type.Optional(Type.String()),
		type: Type.Optional(Type.Literal("book")),
		pageLayout: Type.Optional(Type.Literal("none")),
		customChaptersText: Type.Optional(Type.String()),
		tags: Type.Optional(Type.Array(Type.String())),
		published: Type.Union([
			Type.String({ format: "date" }),
			Type.String({ format: "date-time" }),
		]),
		noindex: Type.Optional(Type.Boolean({ default: false })),
		version: Type.Optional(Type.String()),
		upToDateSlug: Type.Optional(Type.String()),
		buttons: Type.Optional(Type.Array(CollectionButtonSchema)),
		chapterList: Type.Optional(
			Type.Array(Type.Union([CollectionCurrentPost, CollectionFuturePost])),
		),
	},
	{
		additionalProperties: false,
		examples: [
			{
				title: "My Collection",
				description: "A collection of my favorite posts.",
				coverImg: "./cover.jpg",
				published: "2023-01-01T00:00:00Z",
				tags: ["tag1", "tag2"],
				buttons: [
					{
						text: "Learn More",
						url: "/learn-more",
					},
					{
						post: "abc123",
					},
				],
			},
		],
	},
);
