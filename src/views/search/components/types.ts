import type { PersonInfo } from "#types/PersonInfo.ts";

export interface ExtendedTag {
	tag: string;
	displayName?: string;
	numPosts: number;
	image?: string;
	emoji?: string;
}

export interface ExtendedUnicorn extends PersonInfo {
	numPosts: number;
}
