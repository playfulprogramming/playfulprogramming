import { PronounInfo } from "./PronounInfo";
import { RolesEnum } from "./RolesInfo";
import { IGatsbyImageData } from "gatsby-plugin-image";

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
		linkedIn?: string;
		twitch?: string;
		dribbble?: string;
	};
	pronouns: PronounInfo;
	profileImg: {
		childImageSharp: {
			smallPic: IGatsbyImageData;
			mediumPic: IGatsbyImageData;
			bigPic: IGatsbyImageData;
		};
	};
}
