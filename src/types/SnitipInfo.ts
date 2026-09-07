import Type, { type Static } from "typebox";
import type { TagInfo } from "./TagInfo.ts";

export const SnitipInfoSchema = Type.Object(
	{
		icon: Type.Optional(Type.String()),
		title: Type.String(),
		links: Type.Array(
			Type.Object({
				name: Type.String(),
				href: Type.String(),
			}),
			{ default: [] },
		),
		tags: Type.Array(Type.String(), { default: [] }),
	},
	{
		additionalProperties: false,
	},
);

export type RawSnitipInfo = Static<typeof SnitipInfoSchema>;

export interface SnitipInfo extends Omit<RawSnitipInfo, "links"> {
	id: string;
	content: string;
	links: SnitipLink[];
	tagsMeta: Map<string, TagInfo>;
}

export interface SnitipLink {
	name: string;
	href: string;
}
