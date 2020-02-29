import { PronounInfo } from "./PronounInfo";
import { RolesEnum } from "./RolesInfo";

export interface UnicornInfo {
	name: string;
	firstName: string;
	lastName: string;
	id: string;
	description: string;
	color: string;
	fields: {
		isAuthor: true;
	};
	roles: RolesEnum[];
	socials: {
		twitter?: string;
		github?: string;
		website?: string;
	};
	pronouns: PronounInfo;
	profileImg: {
		childImageSharp: {
			smallPic: {
				fixed: string;
			};
			mediumPic: {
				fixed: string;
			};
			bigPic: {
				fixed: string;
			};
		};
	};
}
