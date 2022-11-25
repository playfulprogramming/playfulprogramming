import { MarkdownInstance } from "astro";
import { Languages } from "types/index";
import { UnicornInfo } from "./UnicornInfo";

export interface RawCollectionInfo {
	title: string;
	associatedSeries: string;
	description: string;
	authors: string[];
	coverImg: string;
	socialImg?: string;
	type?: "book";
	published: string;
	buttons: Array<{ text: string; url: string }>;
	chapterList?: Array<{
		title: string;
		description: string;
		order: string;
	}>;
}

export interface CollectionInfo extends RawCollectionInfo {
	slug: string;
	locale: Languages;
	authorsMeta: UnicornInfo[];
	Content: MarkdownInstance<never>["Content"];
	contentMeta: string;
	licenseMeta: null;
	publishedMeta: string;
	collectionSlug: null;
	excerpt: string;
	wordCount: number;
}
