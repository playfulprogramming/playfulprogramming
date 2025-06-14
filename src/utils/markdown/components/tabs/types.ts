import { PlayfulNode } from "../components";

export interface TabInfo {
	slug: string;
	name: string;
	contents: PlayfulNode[];

	// array of header slugs that are inside the header contents, for URL hash behavior
	headers: string[];
}
