import { UnicornInfo } from "./UnicornInfo";

export interface PostInfoListDisplay {
	id: string;
	excerpt: string;
	frontmatter: {
		title: string;
		published: string;
		subtitle?: string;
		tags: string[];
		description: string;
		authors: Array<
			Pick<UnicornInfo, "name" | "id" | "color"> & {
				profileImg: {
					childImageSharp: { smallPic: string };
				};
			}
		>;
	};
	fields: {
		slug: string;
		inlineCount: number;
	};
	wordCount: {
		words: number;
	};
}
