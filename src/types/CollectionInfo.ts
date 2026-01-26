import { Languages } from "types/index";

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
	coverImgMeta: {
		// Relative to "public/people"
		relativePath: string;
		// Relative to site root
		relativeServerPath: string;
		// This is not stored, it's generated at build time
		absoluteFSPath: string;
		height: number;
		width: number;
	};
}

export interface SearchCollectionInfo extends CollectionInfo {
	id: string;
	excerpt: string;
	searchMeta: string;
	publishedTimestamp: number;
}
