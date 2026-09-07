import type { WarningInfo } from "#src/utils/markdown/types.ts";
import type { Locale } from "#src/paraglide/runtime.js";
import { Type, type Static } from "typebox";

export const PersonInfoSchema = Type.Object(
	{
		name: Type.String(),
		firstName: Type.Optional(Type.String()),
		lastName: Type.Optional(Type.String()),
		description: Type.String({ default: "" }),
		profileImg: Type.String(),
		color: Type.Optional(Type.String()),
		socials: Type.Partial(
			Type.Record(
				Type.Enum([
					"twitter",
					"github",
					"gitlab",
					"website",
					"linkedIn",
					"twitch",
					"dribbble",
					"mastodon",
					"threads",
					"youtube",
					"cohost",
					"bluesky",
				]),
				Type.String(),
			),
			{ default: {} },
		),
		pronouns: Type.Optional(Type.String()),
		// Raw id of the roles
		roles: Type.Array(Type.String(), { default: [] }),
		achievements: Type.Array(Type.String(), { default: [] }),
		// Pretty name for the role
		boardRoles: Type.Array(Type.String(), { default: [] }),
	},
	{
		additionalProperties: false,
	},
);

export interface PersonStub {
	kind: "person";
	id: string;
	slug: string;
	file: string;
	locale: Locale;
	locales: Locale[];
	warnings: WarningInfo[];
}

export type RawPersonInfo = Static<typeof PersonInfoSchema>;

export interface PersonInfo extends Required<RawPersonInfo>, PersonStub {
	id: string;
	file: string;
	locale: Locale;
	locales: Locale[];
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
