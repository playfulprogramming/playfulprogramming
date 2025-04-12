import { Languages } from ".";

export interface RawPersonInfo {
	name: string;
	firstName: string;
	lastName: string;
	description: string;
	socials: {
		twitter?: string;
		github?: string;
		gitlab?: string;
		website?: string;
		linkedIn?: string;
		twitch?: string;
		dribbble?: string;
		mastodon?: string;
		threads?: string;
		youtube?: string;
		cohost?: string;
		bluesky?: string;
	};
	pronouns?: string;
	profileImg: string;
	color?: string;
	// Raw id of the roles
	roles?: Array<string>;
	achievements?: string[];
	// Pretty name for the role
	boardRoles?: Array<string>;
}

export interface PersonInfo extends Required<RawPersonInfo> {
	kind: "person";
	id: string;
	file: string;
	locale: Languages;
	locales: Languages[];
	totalPostCount: number;
	totalWordCount: number;
	profileImgMeta: {
		// Relative to "public/people"
		relativePath: string;
		// Relative to site root
		relativeServerPath: string;
		// This is not stored, it's generated at build time
		absoluteFSPath: string;
		height: number;
		width: number;
	};
}
