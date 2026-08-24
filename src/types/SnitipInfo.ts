import type { TagInfo } from "./TagInfo.ts";

export interface RawSnitipInfo {
	icon?: string;
	title: string;
	links?: SnitipLink[];
	tags: string[];
}

export interface SnitipInfo extends Omit<RawSnitipInfo, "links"> {
	id: string;
	content: string;
	links: SnitipLink[];
	tagsMeta: Map<string, TagInfo>;
}

export interface SnitipLink {
	name: string;
	href: string;
}
