import { UnicornInfo } from "./UnicornInfo";
import { LicenseInfo } from "./LicenseInfo";

export interface PostInfo {
	id: string;
	excerpt: string;
	html: string;
	frontmatter: {
		title: string;
		published: string;
		tags: string[];
		description: string;
		authors: Array<UnicornInfo>;
		license: LicenseInfo;
	};
	fields: {
		slug: string;
	};
	wordCount: {
		words: number;
	};
}
