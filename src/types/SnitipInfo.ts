import { TagInfo } from "./TagInfo";

export interface RawSnitipInfo {
	icon?: string;
	title: string;
	links: SnitipLink[];
	tags: string[];
}

export interface SnitipInfo extends RawSnitipInfo {
	id: string;
	content: string;
	tagsMeta: Map<string, TagInfo>;
}

export interface SnitipLink {
	name: string;
	href: string;
}
