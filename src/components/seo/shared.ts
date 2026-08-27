import type { PersonInfo } from "../../types/index.ts";
import type { Locale } from "#src/paraglide/runtime.js";

export interface SEOProps {
	description?: string;
	providedLangs?: Locale[];
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
