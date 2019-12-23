import { UnicornInfo } from "./UnicornInfo";
import { LicenseInfo } from "./LicenseInfo";

export interface PostInfoListDisplay {
	id: string;
	excerpt: string;
	frontmatter: {
		title: string;
		published: string;
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
	};
	wordCount: {
		words: number;
	};
}
