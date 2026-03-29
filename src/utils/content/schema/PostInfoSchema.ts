import { Type } from "typebox";

export const PostInfoSchema = Type.Object(
	{
		title: Type.String(),
		published: Type.Union([
			Type.String({ format: "date" }),
			Type.String({ format: "date-time" }),
		]),
		description: Type.String({ default: "" }),
		version: Type.String({ default: "" }),
		noindex: Type.Optional(Type.Boolean({ default: false })),
		authors: Type.Optional(Type.Array(Type.String())),
		tags: Type.Optional(Type.Array(Type.String())),
		edited: Type.Optional(Type.String({ format: "date-time" })),
		socialImg: Type.Optional(Type.String()),
		bannerImg: Type.Optional(Type.String()),
		originalLink: Type.Optional(Type.String({ format: "url" })),
		order: Type.Optional(Type.Number()),
		upToDateSlug: Type.Optional(Type.String()),
		license: Type.Optional(
			Type.Union([
				Type.Literal("cc-by-4"),
				Type.Literal("cc-by-nc-sa-4"),
				Type.Literal("cc-by-nc-nd-4"),
				Type.Literal("coderpad"),
				Type.Literal("publicdomain-zero-1"),
			]),
		),
	},
	{
		additionalProperties: false,
	},
);
