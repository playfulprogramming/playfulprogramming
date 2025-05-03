import { TagInfo } from "./TagInfo";

export interface SnitipMetadata {
	href?: string;
	icon?: string;
	title: string;
	content: string;
	links: SnitipLink[];
	tags: Map<string, TagInfo>;
}

export interface SnitipLink {
	name: string;
	href: string;
}
