import { Languages } from "types/index";
import { LocalFile } from "types/LocalFile";

export interface FuturePost {
	order: number;
	title: string;
	description?: string;
}

export interface CurrentPost {
	post: string;
}

export interface CollectionButton {
	text: string;
	url: string;
}

export interface RawCollectionInfo {
	title: string;
	description: string;
	authors?: string[];
	coverImg: string;
	socialImg?: string;
	type?: "book";
	pageLayout?: "none";
	customChaptersText?: string;
	tags?: string[];
	published: string;
	noindex?: boolean;
	version?: string;
	upToDateSlug?: string;
	buttons?: CollectionButton[];
	chapterList?: Array<CurrentPost | FuturePost>;
}

export interface CollectionInfo extends RawCollectionInfo {
	kind: "collection";
	slug: string;
	file: string;
	authors: string[];
	tags: string[];
	locales: Languages[];
	locale: Languages;
	postCount: number;
	coverImgMeta: LocalFile;
}

export interface SearchCollectionInfo extends CollectionInfo {
	id: string;
	excerpt: string;
	searchMeta: string;
	publishedTimestamp: number;
}
