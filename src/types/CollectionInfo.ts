import { Languages } from "types/index";

export interface ExternalPost {
	title: string;
	url?: string;
	description?: string;
}

export interface LocalPost {
	post: string;
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
	buttons?: Array<{ text: string; url: string }>;
	chapterList?: Array<ExternalPost | LocalPost>;
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
	excerpt: string;
	searchMeta: string;
	publishedTimestamp: number;
}
