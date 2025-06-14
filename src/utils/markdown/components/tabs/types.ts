export interface TabInfo {
	slug: string;
	name: string;

	// array of header slugs that are inside the header contents, for URL hash behavior
	headers: string[];
}
