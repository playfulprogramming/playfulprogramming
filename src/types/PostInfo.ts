import type { Locale } from "#src/paraglide/runtime.js";
import type { LocalFile } from "#types/LocalFile.ts";
import { Type, type Static } from "typebox";

export const PostInfoSchema = Type.Object(
	{
		title: Type.String(),
		published: Type.Union([
			Type.String({ format: "date" }),
			Type.String({ format: "date-time" }),
		]),
		description: Type.String({ default: "" }),
		version: Type.Optional(Type.String()),
		noindex: Type.Optional(Type.Boolean({ default: false })),
		authors: Type.Optional(Type.Array(Type.String())),
		tags: Type.Optional(Type.Array(Type.String())),
		edited: Type.Optional(
			Type.Union([
				Type.String({ format: "date" }),
				Type.String({ format: "date-time" }),
			]),
		),
		coverImg: Type.Optional(Type.String()),
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

export interface PostStub {
	kind: "post";
	slug: string;
	file: string;
	locales: Locale[];
	locale: Locale;
	authors: string[];
	collection?: string;
}

export type RawPostInfo = Static<typeof PostInfoSchema>;

export interface PostInfo extends RawPostInfo, PostStub {
	authors: string[];
	tags: string[];
	description: string;
	excerpt: string;
	path: string;
	publishedMeta: string;
	editedMeta?: string;
	wordCount: number;
	socialImgMeta?: LocalFile;
	coverImgMeta?: LocalFile;
}

export interface SearchPostInfo extends PostInfo {
	id: string;
	banner?: string;
	searchMeta: string;
	publishedTimestamp: number;
}

export interface PostHeadingInfo {
	// Title value
	value: string;
	// ID
	slug: string;
	depth: number;
}

export interface PostVersion {
	href: string;
	version: PostInfo["version"];
	published: PostInfo["published"];
	publishedMeta: PostInfo["publishedMeta"];
}
