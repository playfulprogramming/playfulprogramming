import type { Languages, PersonInfo } from "../../types/index.ts";

export interface SEOProps {
	description?: string;
	providedLangs?: Languages[];
	title: string;
	peopleData?: PersonInfo[];
	keywords?: string[];
	publishedTime?: string;
	editedTime?: string;
	type?: "article" | "profile" | "book";
	canonical?: string;
	isbn?: string;
	shareImage?: string;
	noindex?: boolean;
}
