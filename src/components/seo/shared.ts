import { Languages, UnicornInfo } from "../../types";

export interface SEOProps {
	description?: string;
	providedLangs?: Languages[];
	title: string;
	unicornsData?: UnicornInfo[];
	keywords?: string[];
	publishedTime?: string;
	editedTime?: string;
	type?: "article" | "profile" | "book";
	canonical?: string;
	isbn?: string;
	shareImage?: string;
	noindex?: boolean;
}
