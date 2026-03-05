import type { Languages } from "#types/index";
import type { LocalFile } from "#types/LocalFile";

export interface PostStub {
	kind: "post";
	slug: string;
	file: string;
	locales: Languages[];
	locale: Languages;
	authors: string[];
	collection?: string;
}

export interface RawPostInfo {
	title: string;
	published: string;
	authors?: string[];
	tags?: string[];
	license?: string;
	description?: string;
	edited?: string;
	collection?: string;
	order?: number;
	originalLink?: string;
	noindex?: boolean;
	version?: string;
	upToDateSlug?: string;
	socialImg?: string;
	coverImg?: string;
}

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
	publishedMeta: PostInfo["publishedMeta"];
}
